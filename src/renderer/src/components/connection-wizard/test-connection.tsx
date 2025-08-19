import { Button } from '../ui/button'
import { toast } from 'sonner'
import { ConnectionDetail, DatabaseInfo } from './wizard.type'
import { api } from '@renderer/utils/api'

interface TestConnectionProp {
  selectedDatabase: DatabaseInfo
  connectionDetail: ConnectionDetail
  setIsTested: (isTested: boolean) => void
}

export default function TestConnection({
  selectedDatabase,
  connectionDetail,
  setIsTested
}: TestConnectionProp): React.JSX.Element {
  const handleTest = async (): Promise<void> => {
    const payload = {
      type: selectedDatabase.id,
      host: connectionDetail.host,
      port: connectionDetail.port,
      username: connectionDetail.username,
      password: connectionDetail.password,
      name: connectionDetail.databaseName
    }

    const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v != null))

    api
      .post('/api/user/db/connect/test', filteredPayload)
      .then((response) => {
        const flag = response.data as boolean
        setIsTested(flag)
      })
      .catch(() => {
        toast.error('데이터베이스 연결 테스트 중 오류가 발생했습니다.')

        // FIXME: 테스트시에 true
        setIsTested(false)
      })
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="self-stretch w-full inline-flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-genie-100 text-sm font-bold font-['Pretendard'] leading-[21px]">
          연결 테스트
        </div>
        <div className="self-stretch p-5 bg-gradient-genie-darkgray rounded-lg outline-1 outline-offset-[-1px] outline-genie-700 inline-flex items-center justify-center gap-4">
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
            <div className="text-center justify-start text-genie-100 text-base font-bold font-['Pretendard'] leading-normal">
              설정한 정보로 연결 테스트를 시작합니다.
            </div>
          </div>
          <div
            data-status="Point"
            className="bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2"
          >
            <Button size={'sm'} onClick={handleTest}>
              <div className="justify-start text-genie-100 text-xs font-semibold font-['Pretendard'] leading-[18px]">
                연결 테스트 시작하기
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
