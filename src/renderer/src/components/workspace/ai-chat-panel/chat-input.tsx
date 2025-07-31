import { BotMessageSquare, ChevronRight, Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSendMessage: (content: string) => void
}

/**
 * @author nahyeongjin1
 * @summary AI 채팅 메시지 입력창
 * @returns JSX.Element
 */
export default function ChatInput({ onSendMessage }: ChatInputProps): React.JSX.Element {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSend = (): void => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="self-stretch p-4 bg-neutral-800">
      <div className="self-stretch p-4 bg-gradient-to-b from-[#1d1d1d] to-[#272727] rounded-2xl outline-1 outline-offset-[-1px] outline-white/20 flex flex-col justify-start items-start gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="무엇이든 물어보세요!"
          className="self-stretch bg-transparent text-neutral-200 text-xs font-medium font-['Pretendard'] leading-[14px] placeholder:text-zinc-500 focus:outline-none resize-none max-h-[44px] overflow-y-auto"
          rows={1}
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
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
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
}
