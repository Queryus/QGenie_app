import { AlertCircle, CheckCircle2, FolderOpen } from 'lucide-react'
import { DatabaseInfo } from './wizard.type'
import { Button } from '../ui/button'
import { useEffect, useRef, useState } from 'react'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'

interface InstallDriverProp {
  selectedDatabase: DatabaseInfo
  isDriverDownloaded: boolean
  setIsDriverDownloaded: (isDriverDownloaded: boolean) => void
}

interface DBData {
  db_type: string
  is_installed: boolean
  driver_name: string
  driver_version: string
  driver_size_bytes: number
}

/**
 * DB 드라이버 확인 및 설치 페이지
 *
 * @author 6-keem
 * @param selectedDatabase 선택한 DB 변수 (상태)
 * @returns JSX.Element
 */
export default function InstallDriver({
  selectedDatabase,
  isDriverDownloaded,
  setIsDriverDownloaded
}: InstallDriverProp): React.JSX.Element {
  const didFetch = useRef(false)
  const [dbData, setDBdata] = useState<DBData>()

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    api
      .get(`/api/driver/info/${selectedDatabase?.id}`)
      .then((driverData) => {
        setDBdata(driverData.data as DBData)
        setIsDriverDownloaded(true)
        toast.success('데이터베이스 드라이버 확인 완료 🎉')
      })
      .catch(() => {
        setIsDriverDownloaded(false)
        toast.error('데이터베이스 드라이버 확인 중 오류가 발생했습니다.')
      })
  })

  // NOTE: 수동 다운로드 보류 (sqlserver)
  // const handleManualDownload = (): void => {
  //   if (!downloadUrl) throw Error('드라이버 다운로드 링크 없음')

  //   window.api.send('open-external', downloadUrl)
  // }

  return (
    <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
      <div className="self-stretch justify-start text-genie-100 text-sm font-bold font-['Pretendard'] leading-[21px]">
        드라이버 확인 및 설치
      </div>
      <div className="self-stretch p-5 bg-gradient-genie-darkgray rounded-lg  outline-1 outline-offset-[-1px] outline-genie-700 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="size- inline-flex flex-col justify-start items-start gap-1">
            <div className="text-start justify-start text-genie-100 text-base font-bold font-['Pretendard'] leading-normal">
              {selectedDatabase.label}
            </div>
            <div
              className={`flex items-center gap-1 ${isDriverDownloaded ? 'text-primary-light' : 'text-error'}`}
            >
              {isDriverDownloaded ? (
                <CheckCircle2 className={`size-4`} />
              ) : (
                <AlertCircle className={`size-4`} />
              )}
              <span className="text-xs font-medium font-['Pretendard']">
                {isDriverDownloaded ? '드라이버가 설치됨' : '드라이버가 설치되지 않음'}
              </span>
            </div>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div
              className={`text-genie-100 bg-gradient-to-b bg-gradient-genie-gray rounded-lg  outline-1 outline-offset-[-1px]
                 outline-white/20 flex justify-center items-center gap-2 ${isDriverDownloaded && 'cursor-not-allowed'}`}
            >
              <Button size={'sm'} className="m-0 p-0" disabled={isDriverDownloaded}>
                <FolderOpen className="size-3 relative overflow-hidden" />
                <div className="justify-start text-xs font-semibold font-['Pretendard'] leading-[18px]">
                  수동 설치
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="size- flex flex-col justify-start items-start gap-1">
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="text-center justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
              버전
            </div>
            <div className="text-center justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
              {dbData?.driver_version}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="text-center justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
              파일명
            </div>
            <div className="text-center justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
              {dbData?.driver_name}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="text-center justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
              크기
            </div>
            <div className="text-center justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
              {dbData?.driver_size_bytes}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
