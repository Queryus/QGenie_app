/**
 * @author nahyeongjin1
 * @summary 쿼리 실행 결과 패널
 * @returns JSX.Element
 */
export default function QueryResults(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col h-full">
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
  )
}
