import { ChartColumn, Code2, Download } from 'lucide-react'
import { DbSchemaPanel } from './db-schema-panel'
import { AiChatPanel } from './ai-chat-panel'

const WorkSpace = (): React.JSX.Element => {
  return (
    <main className="flex flex-1 h-full bg-zinc-900 pt-2 pr-2 pb-2">
      {/* DB Schema Panel (Left) */}
      <DbSchemaPanel />

      {/* Main Content (Center & Right) */}
      <div className="flex flex-1 h-full ml-2 gap-2">
        {/* AI Chat Panel (Center) */}
        <AiChatPanel />

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
