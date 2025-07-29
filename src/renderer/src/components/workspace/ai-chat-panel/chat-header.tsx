import { BotMessageSquare, History, Search, X } from 'lucide-react'

/**
 * @author nahyeongjin1
 * @summary AI 채팅 패널의 헤더
 * @returns JSX.Element
 */
export default function ChatHeader(): React.JSX.Element {
  return (
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
  )
}
