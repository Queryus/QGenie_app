import { CircleCheck } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface TestConnectionProp {
  setIsTested: (isTested: boolean) => void
}
export default function TestConnection({ setIsTested }: TestConnectionProp): React.JSX.Element {
  const handleTest = (): void => {
    /**
     * FIXME:
     *
     * 1. 테스트 API 호출
     * 2. API 응답 결과 따라 분기
     */
    const flag = true
    if (flag) {
      toast.success('연결 테스트 성공')
      setIsTested(true)
    } else {
      toast.error('연결 테스트 실패')
      setIsTested(false)
    }
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
      <div className="self-stretch w-full inline-flex flex-col justify-start items-start gap-6">
        <div className="self-stretch p-5 bg-gradient-genie-darkgray rounded-lg outline-1 outline-offset-[-1px] outline-genie-700 flex flex-col justify-start items-start gap-4">
          <div className="inline-flex justify-center items-center gap-2 text-genie-100">
            <CircleCheck className="w-4 h-4 relative overflow-hidden" />
            <div className="text-center justify-start text-genie-100 text-base font-bold font-['Pretendard'] leading-normal">
              테스트 항목
            </div>
          </div>
          <div className="justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
            드라이버 로드 확인
            <br />
            호스트 및 포트 접근성 확인
            <br />
            인증 정보 검증
            <br />
            데이터베이스 접근 권한 확인
            <br />
            기본 쿼리 실행 테스트
          </div>
        </div>
      </div>
    </div>
  )
}
