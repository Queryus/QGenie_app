import { BotMessageSquare, ChevronRight, Send } from 'lucide-react'

/**
 * @author nahyeongjin1
 * @summary AI 채팅 메시지 입력창
 * @returns JSX.Element
 */
export default function ChatInput(): React.JSX.Element {
  return (
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
            <div className="py-0.75 justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
              전송하기
            </div>
            <Send className="size-3 stroke-[#E4E4E4]" />
          </div>
        </div>
      </div>
    </div>
  )
}
