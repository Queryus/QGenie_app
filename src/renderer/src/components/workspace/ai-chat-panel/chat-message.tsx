import { Copy, Play, Save, Sparkles } from 'lucide-react'
import { ChatMessageData } from './ai-chat.types'

interface ChatMessageProps {
  message: ChatMessageData
}

/**
 * @author nahyeongjin1
 * @summary 개별 채팅 메시지 컴포넌트
 * @param message 메시지 데이터
 * @returns JSX.Element
 */
export default function ChatMessage({ message }: ChatMessageProps): React.JSX.Element {
  const { sender, content, sql, suggestions } = message

  const isUser = sender === 'user'
  const isSystem = sender === 'system'

  if (isSystem) {
    return (
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
          {content.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </div>
        {suggestions && (
          <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2"
              >
                <Sparkles className="size-3 stroke-[#E4E4E4]" />
                <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
                  {suggestion}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`self-stretch flex flex-col justify-start gap-3 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      {!isUser && (
        <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
          {content}
        </div>
      )}
      {isUser && (
        <div className="w-fit max-w-md px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 inline-flex justify-center items-center gap-2.5">
          <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
            {content}
          </div>
        </div>
      )}
      {sql && (
        <div className="self-stretch p-4 bg-zinc-900 rounded-lg flex flex-col justify-start items-end gap-4">
          <div className="self-stretch justify-start text-neutral-200 text-sm font-normal font-['JetBrains_Mono'] leading-tight">
            {sql}
          </div>
          <div className="inline-flex justify-start items-start gap-2.5">
            <div className="px-3 py-1.5 bg-neutral-800 rounded-md outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center gap-2">
              <Play className="size-4 stroke-[#E4E4E4]" />
              <div className="py-0.75 justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                실행
              </div>
            </div>
            <div className="px-3 py-1.5 bg-neutral-800 rounded-md outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center gap-2">
              <Copy className="size-4 stroke-[#E4E4E4]" />
              <div className="py-0.75 justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                복사
              </div>
            </div>
            <div className="px-3 py-1.5 bg-neutral-800 rounded-md outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center gap-2">
              <Save className="size-4 stroke-[#E4E4E4]" />
              <div className="py-0.75 justify-start text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
                저장
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
