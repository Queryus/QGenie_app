import { JSX, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FooterButtons } from './footer-buttons'
import { SelectDatabase } from './select-database'
import { ConnectionDetail, DatabaseInfo, DBSetupStep } from './wizard.type'
import Sidebar from './sidebar'
import InstallDriver from './install-driver'
import EnterConnectionDetails from './enter-connection-details'
import TestConnection from './test-connection'
import ConfirmSettings from './confirm-settings'
import { api } from '@renderer/utils/api'

export function ConnectionWizard(): JSX.Element {
  // 현재 탭
  const [activeTab, setActiveTab] = useState<DBSetupStep>(DBSetupStep.SelectDatabase)
  // DB 선택
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseInfo | null>(null)
  // 연결 테스트
  const [isTested, setIsTested] = useState(false)
  const [isDriverDownloaded, setIsDriverDownloaded] = useState(false)

  const [errorFields, setErrorFields] = useState<{ [key: string]: boolean }>({})

  // DB 연결 정보
  const [connectionDetail, setConnectionDetail] = useState<ConnectionDetail>({
    nickname: null,
    databaseName: '',
    username: null,
    password: null,
    host: 'localhost',
    port: 3306,
    databaseType: null
  })

  useEffect(() => {
    document.title = '마법사'
  }, [])

  // DB 선택 변경 시
  useEffect(() => {
    if (selectedDatabase) {
      setConnectionDetail((prev) => ({
        ...prev,
        databaseType: selectedDatabase.key
      }))

      // DB 드라이버 다운로드 여부 상태 초기화
      setIsDriverDownloaded(false)
    }
  }, [selectedDatabase])

  // DB 혹은 연결 정보 변경 시 다시 테스트 수행
  useEffect(() => {
    setIsTested(false)
  }, [connectionDetail, selectedDatabase])

  // 탭 이동시 검사
  const moveStep = (nextStep: DBSetupStep): void => {
    // 디비 선택 안 된 경우
    if (
      activeTab === DBSetupStep.SelectDatabase &&
      nextStep === DBSetupStep.InstallDriver &&
      selectedDatabase === null
    ) {
      toast.error('데이터베이스를 선택하세요')
      return
    }

    if (
      activeTab === DBSetupStep.InstallDriver &&
      nextStep === DBSetupStep.EnterConnectionDetails &&
      !isDriverDownloaded
    ) {
      toast.error('드라이버가 없습니다.')
      return
    }

    // 필수 연결 정보 누락 시
    if (
      activeTab === DBSetupStep.EnterConnectionDetails &&
      nextStep === DBSetupStep.TestConnection
    ) {
      const errors: { [key: string]: boolean } = {}

      // DBMS별 필수 필드
      const requiredFieldsMap: Record<string, (keyof ConnectionDetail)[]> = {
        sqlite: ['databaseName'],
        mysql: ['host', 'port', 'username', 'password'],
        mariadb: ['host', 'port', 'username', 'password'],
        postgresql: ['host', 'port', 'username', 'password'],
        oracle: ['host', 'port', 'username', 'password', 'databaseName']
      }

      const requiredFields = selectedDatabase ? requiredFieldsMap[selectedDatabase.id] || [] : []

      // 필수 값 체크
      requiredFields.forEach((field) => {
        const value = connectionDetail[field]
        if (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          errors[field] = true
        }
      })

      if (Object.keys(errors).length > 0) {
        setErrorFields(errors)
        toast.error('필수 항목을 입력하세요.')
        return
      }

      // 모든 필드가 채워졌으면 에러 초기화
      setErrorFields({})
    }

    // 테스트 안한 경우
    if (activeTab === DBSetupStep.TestConnection && !isTested) {
      if (nextStep === DBSetupStep.ConfirmSettings) {
        toast.info('연결 테스트를 진행해주세요')
        return
      }
    }

    // 안 걸렸으면 탭 이동
    setActiveTab(nextStep)
  }

  // 첫 페이지에서 취소 버튼을 눌렀을 때
  const onClose = (): void => {
    window.api.closeCurrentWindow()
  }

  // 마지막 페이지에서 완료를 눌렀을 때
  const onSave = async (): Promise<void> => {
    if (Object.keys(errorFields).length !== 0) return

    const payload = {
      type: selectedDatabase!.id,
      host: connectionDetail.host,
      port: connectionDetail.port,
      username: connectionDetail.username,
      password: connectionDetail.password,
      name: connectionDetail.databaseName,
      view_name: connectionDetail.nickname
    }

    const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v != null))

    try {
      const response = await api.post('/api/user/db/create/profile', filteredPayload)
      const id = response.data.id as string
      await createAnnotation(id)

      // 메인 프로세스를 통해 메인 윈도우에 변경 사항을 알립니다.
      window.electron.ipcRenderer.send('connections-updated')
      toast.success('데이터베이스 연결이 성공적으로 저장되었습니다.')
      onClose()
    } catch (error) {
      toast.error('데이터베이스 연결 저장 중 오류가 발생했습니다.')
      console.error('Failed to save connection:', error)
    }
  }

  const createAnnotation = async (db_profile_id: string): Promise<void> => {
    try {
      await api.post('/api/annotations/create', {
        db_profile_id: db_profile_id
      })
    } catch (error) {
      // 어노테이션 생성 실패는 일단 에러 토스트만 띄우고 플로우는 계속 진행시킵니다.
      toast.error('어노테이션 생성 중 오류가 발생했습니다.')
      console.error('Failed to create annotation:', error)
    }
  }

  return (
    <div className={`flex w-full h-screen min-w-[800px] items-center justify-center`}>
      <div className="flex-[7] h-full bg-genie-900">
        <Sidebar activeTab={activeTab} />
      </div>
      <div className="flex-[13] self-stretch h-full bg-genie-900 inline-flex justify-start items-center">
        <div className="w-full h-full p-6 bg-genie-800 inline-flex flex-col justify-between items-start space-y-6">
          {activeTab === DBSetupStep.SelectDatabase && (
            <SelectDatabase
              selectedDatabase={selectedDatabase}
              setSelectedDatabase={setSelectedDatabase}
              connectionName={connectionDetail.nickname ? connectionDetail.nickname : ''}
              setConnectionName={(value) => {
                setConnectionDetail((prev) => ({ ...prev, nickname: value }))
              }}
            />
          )}
          {activeTab === DBSetupStep.InstallDriver && selectedDatabase !== null && (
            <InstallDriver
              selectedDatabase={selectedDatabase!}
              isDriverDownloaded={isDriverDownloaded}
              setIsDriverDownloaded={setIsDriverDownloaded}
            />
          )}
          {activeTab === DBSetupStep.EnterConnectionDetails && (
            <EnterConnectionDetails
              connectionDetail={connectionDetail}
              setConnectionDetail={setConnectionDetail}
              errorFields={errorFields}
              setErrorFields={setErrorFields}
            />
          )}
          {activeTab === DBSetupStep.TestConnection && (
            <TestConnection
              selectedDatabase={selectedDatabase!}
              connectionDetail={connectionDetail}
              isTested={isTested}
              setIsTested={setIsTested}
            />
          )}
          {activeTab === DBSetupStep.ConfirmSettings && (
            <ConfirmSettings connectionDetail={connectionDetail} />
          )}
          <FooterButtons
            activeTab={activeTab}
            setActiveTab={(nextStep: DBSetupStep) => {
              moveStep(nextStep)
            }}
            onClose={onClose}
            onSave={onSave}
          />
        </div>
      </div>
    </div>
  )
}
