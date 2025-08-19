import { DATABASES, ConnectionDetail } from './wizard.type'

interface ConfirmSettingsProp {
  connectionDetail: ConnectionDetail
}

type ConnectionValue = string | number | null

/**
 * DB 연결 정보 확인 및 완료
 *
 * @author 6-keem
 *
 * @param connectionDetail DB 연결 정보 (상태)
 * @returns JSX.Element
 */
export default function ConfirmSettings({
  connectionDetail
}: ConfirmSettingsProp): React.JSX.Element {
  const entries = Object.entries(connectionDetail) as [keyof ConnectionDetail, ConnectionValue][]

  const labelMap: Record<keyof ConnectionDetail, string> = {
    nickname: '데이터베이스 연결 이름',
    databaseName: '데이터베이스명',
    username: '사용자명',
    password: '비밀번호',
    host: '호스트',
    port: '포트',
    databaseType: '데이터베이스'
  }

  const displayValue = (key: keyof ConnectionDetail, value: ConnectionValue): string => {
    if (key === 'databaseType') {
      if (!value) return ''
      const db = DATABASES.find((d) => d.key === value)
      return db ? db.label : value.toString()
    }
    if (key === 'password') {
      return value ? '••••••' : ''
    }
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    return value.toString()
  }

  const filteredEntries = entries.filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  )

  return (
    <div className="self-stretch pt-6 inline-flex flex-col justify-start items-center gap-6">
      <div className="size-[100px] bg-genie-700 rounded-full" />
      <div className="self-stretch text-center justify-start text-genie-100 text-base font-bold font-['Pretendard'] leading-normal">
        연결 설정 완료!
      </div>
      <div className="self-stretch p-5 bg-gradient-genie-darkgray rounded-lg outline-1 outline-offset-[-1px] outline-genie-700 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          {filteredEntries.map(([key, value]) => (
            <div key={key} className="self-stretch inline-flex justify-between items-start">
              <div className="text-center justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
                {labelMap[key] || key}
              </div>
              <div className="text-center justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
                {displayValue(key, value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
