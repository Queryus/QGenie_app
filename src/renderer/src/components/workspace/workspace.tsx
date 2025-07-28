import {
  BotMessageSquare,
  ChartColumn,
  ChevronRight,
  Code2,
  Copy,
  Download,
  History,
  Play,
  Save,
  Search,
  Send,
  Sparkles,
  X
} from 'lucide-react'
import { DbSchemaPanel } from './db-schema-panel'

const WorkSpace = (): React.JSX.Element => {
  return (
    <main className="flex flex-1 h-full bg-zinc-900 pt-2 pr-2 pb-2">
      {/* DB Schema Panel (Left) */}
      <DbSchemaPanel />

      {/* Main Content (Center & Right) */}
      <div className="flex flex-1 h-full ml-2 gap-2">
        {/* AI Chat Panel (Center) */}
        <div className="flex-1 h-full bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
          <div className="self-stretch pl-4 pr-3 py-3 bg-neutral-800 border-b border-neutral-700 inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <BotMessageSquare className="size-4 stroke-[#E4E4E4]" />
              <div className="justify-start text-neutral-200 text-sm font-bold font-['Pretendard'] leading-tight">
                AI 채팅
              </div>
            </div>
            <div className="flex justify-start items-center gap-4">
              <div className="w-40 px-2 py-1.5 bg-gradient-to-b from-stone-900 to-neutral-800 rounded-lg outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-between items-center">
                <div className="flex justify-start items-center gap-2">
                  <Search className="size-4 stroke-[#808080]" />
                  <div className="justify-start text-zinc-500 text-xs font-medium font-['Pretendard'] leading-none">
                    검색
                  </div>
                </div>
                <X className="size-4 stroke-[#808080]" />
              </div>
              <History className="size-4 stroke-[#E4E4E4]" />
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                안녕하세요!
                <br />
                자연어로 데이터베이스에 질문하시면 SQL 쿼리를 자동으로 생성해드립니다.
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap">
                <div className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
                  <Sparkles className="size-3 stroke-[#E4E4E4]" />
                  <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                    가장 많이 팔린 상품 5개 보여줘
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
                  <Sparkles className="size-3 stroke-[#E4E4E4]" />
                  <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                    지난달 매출 총액은 얼마야?
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
                  <Sparkles className="size-3 stroke-[#E4E4E4]" />
                  <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                    고객별 주문 횟수를 내림차순으로 정렬해줘
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-end gap-2.5">
              <div className="w-fit max-w-md px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 inline-flex justify-center items-center gap-2.5">
                <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                  가장 많이 팔린 상품 5개를 매출액과 함께 보여줘
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                가장 많이 팔린 상품 5개를 매출액과 함께 조회하는 쿼리를 생성했습니다.
              </div>
              <div className="self-stretch p-4 bg-zinc-900 rounded-lg flex flex-col justify-start items-end gap-4">
                <div className="self-stretch justify-start text-neutral-200 text-sm font-normal font-['JetBrains_Mono'] leading-tight">
                  SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold,
                  SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN
                  SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID,
                  p.ProductName ORDER BY total_revenue DESC LIMIT 5;
                </div>
                <div className="inline-flex justify-start items-start gap-2.5">
                  <div className="px-3 py-1.5 bg-neutral-800 rounded-md outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center gap-2">
                    <Play className="size-4 stroke-[#E4E4E4]" />
                    <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                      실행
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-neutral-800 rounded-md outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center gap-2">
                    <Copy className="size-4 stroke-[#E4E4E4]" />
                    <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                      복사
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-neutral-800 rounded-md outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center gap-2">
                    <Save className="size-4 stroke-[#E4E4E4]" />
                    <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                      저장
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch p-4 bg-neutral-800">
            <div className="self-stretch p-4 bg-gradient-to-b from-stone-900 to-neutral-800 rounded-2xl outline-1 outline-offset-[-1px] outline-white/20 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-zinc-500 text-xs font-medium font-['Pretendard'] leading-none">
                무엇이든 물어보세요!
              </div>
              <div className="self-stretch inline-flex justify-between items-end">
                <div className="flex justify-start items-center gap-[5px]">
                  <BotMessageSquare className="size-3 stroke-[#E4E4E4]" />
                  <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                    ChatGPT 4o
                  </div>
                  <ChevronRight className="size-3 stroke-[#E4E4E4]" />
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
                  <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                    전송하기
                  </div>
                  <Send className="size-3 stroke-[#E4E4E4]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Query & Results Panel (Right) */}
        <div className="flex-1 h-full flex flex-col gap-2">
          <div className="flex-1 bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
            <div className="self-stretch pl-4 pr-3 py-3 border-b border-neutral-700 inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                <Code2 className="size-4 stroke-[#E4E4E4]" />
                <div className="justify-start text-neutral-200 text-sm font-bold font-['Pretendard'] leading-tight">
                  쿼리 편집기
                </div>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-b from-violet-700 to-violet-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
                <Download className="size-3 stroke-[#E4E4E4]" />
                <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                  내보내기
                </div>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-auto">
              <div className="justify-start text-neutral-200 text-sm font-normal font-['JetBrains_Mono'] leading-tight">
                SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold,
                SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN
                SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID,
                p.ProductName ORDER BY total_revenue DESC LIMIT 5;
              </div>
            </div>
          </div>
          <div className="flex-1 bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
            <div className="self-stretch pl-4 pr-3 py-3 border-b border-neutral-700 inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                <ChartColumn className="size-4 stroke-[#E4E4E4]" />
                <div className="justify-start text-neutral-200 text-sm font-bold font-['Pretendard'] leading-tight">
                  실행 결과
                </div>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-b from-violet-700 to-violet-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
                <Download className="size-3 stroke-[#E4E4E4]" />
                <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                  내보내기
                </div>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-auto">
              <div className="self-stretch rounded-lg outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col justify-start items-start overflow-hidden">
                <div className="self-stretch bg-neutral-700 inline-flex justify-start items-center">
                  <div className="flex-1 p-2 justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                    상품명
                  </div>
                  <div className="flex-1 p-2 justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                    판매량
                  </div>
                  <div className="flex-1 p-2 justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                    매출액
                  </div>
                </div>
                {/* Table Rows */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="self-stretch border-b border-neutral-700 last:border-b-0 inline-flex justify-start items-center"
                  >
                    <div className="flex-1 p-2 justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                      item
                    </div>
                    <div className="flex-1 p-2 justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                      1000
                    </div>
                    <div className="flex-1 p-2 justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                      300,000
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default WorkSpace
