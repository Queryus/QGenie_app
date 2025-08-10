import { JSX, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FooterButtons } from './footer-buttons'
import { SelectDatabase } from './select-database'
import { ConnectionDeatil, DatabaseInfo, DBSetupStep } from './wizard.type'
import Sidebar from './sidebar'
import InstallDriver from './install-driver'
import EnterConnectionDetails from './enter-connection-details'
import TestConnection from './test-connection'
import ConfirmSettings from './confirm-settings'

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
  const [connectionDetail, setConnectionDetail] = useState<ConnectionDeatil>({
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
      /**
       * TODO: 에러 필드 테두리 색깔 바꾸기
       */
      const errors: { [key: string]: boolean } = {}
      if (!connectionDetail.databaseName) {
        errors.databaseName = true
      }
      if (!connectionDetail.host) {
        errors.host = true
      }
      if (!connectionDetail.port) {
        errors.port = true
      }

      if (Object.keys(errors).length > 0) {
        setErrorFields(errors)
        toast.error('필수 항목을 입력하세요.')
        return
      }

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
  const onSave = (): void => {
    /**
     * TODO: connectionDetail 서버에 저장
     */
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
          {activeTab === DBSetupStep.TestConnection && <TestConnection setIsTested={setIsTested} />}
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
