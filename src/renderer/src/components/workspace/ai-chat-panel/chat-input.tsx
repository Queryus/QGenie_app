import { BotMessageSquare, ChevronRight, Send } from 'lucide-react'
import { forwardRef, useEffect } from 'react'

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

/**
 * @author nahyeongjin1
 * @summary AI 채팅 메시지 입력창
 * @returns JSX.Element
 */
const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(function ChatInput(
  { value, onChange, isLoading },
  ref
) {
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const textarea = ref.current
      textarea.style.height = 'auto' // Reset height to correctly calculate scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px` // Set height based on content
    }
  }, [value, ref])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      // The form submission is handled by the parent form's onSubmit
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="self-stretch p-4 bg-neutral-800">
      <div className="self-stretch p-4 bg-gradient-to-b from-[#1d1d1d] to-[#272727] rounded-2xl outline-1 outline-offset-[-1px] outline-white/20 flex flex-col justify-start items-start gap-2">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? 'AI가 답변을 생성중입니다...' : '무엇이든 물어보세요!'}
          className="self-stretch bg-transparent text-neutral-200 text-xs font-medium font-['Pretendard'] leading-[14px] placeholder:text-zinc-500 focus:outline-none resize-none max-h-[44px]"
          rows={1}
          disabled={isLoading}
        />
        <div className="self-stretch inline-flex justify-between items-end">
          <div className="flex justify-start items-center gap-[5px]">
            <BotMessageSquare className="size-3 stroke-[#E4E4E4]" />
            <div className="justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
              ChatGPT 4o
            </div>
            <ChevronRight className="size-3 stroke-[#E4E4E4]" />
          </div>
          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            <div className="py-0.75 justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
              전송하기
            </div>
            <Send className="size-3 stroke-[#E4E4E4]" />
          </button>
        </div>
      </div>
    </div>
  )
})

export default ChatInput
