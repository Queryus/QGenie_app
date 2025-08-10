import { AlertCircle, CheckCircle2, FolderOpen } from 'lucide-react'
import { DatabaseInfo } from './wizard.type'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

interface InstallDriverProp {
  selectedDatabase: DatabaseInfo
  isDriverDownloaded: boolean
  setIsDriverDownloaded: (isDriverDownloaded: boolean) => void
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
  const [version, setVersion] = useState('알 수 없음')
  const [driverName, setDriverName] = useState('알 수 없음')
  const [driverVolume, setDriverVolume] = useState('알 수 없음')
  const [downloadUrl, setDownloadUrl] = useState('')

  useEffect(() => {
    if (!isDriverDownloaded)
      setTimeout(() => {
        handleCheckIsDownloaded()
      }, 1000)
  })

  const handleCheckIsDownloaded = (): void => {
    /**
     * FIXME: API 호출
     *
     * 서버에서 드라이버 여부, 버전 가져와서 랜더링
     */
    setDriverName(selectedDatabase.key + ' driver')
    setVersion('0.0.0')
    setDriverVolume('2MB')
    setIsDriverDownloaded(true)
    setDownloadUrl('https://www.google.com')
  }

  const handleManualDownload = (): void => {
    if (!downloadUrl) throw Error('드라이버 다운로드 링크 없음')

    window.api.send('open-external', downloadUrl)
  }

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
              <Button
                size={'sm'}
                className="m-0 p-0"
                onClick={handleManualDownload}
                disabled={isDriverDownloaded}
              >
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
              {version}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="text-center justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
              파일명
            </div>
            <div className="text-center justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
              {driverName}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="text-center justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
              크기
            </div>
            <div className="text-center justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
              {driverVolume}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
