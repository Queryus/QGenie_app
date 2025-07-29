import { Copy, Play, Save, Sparkles } from 'lucide-react'
import { ChatMessageData } from './ai-chat.types'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessageData
  highlightTerm?: string
}

/**
 * @author nahyeongjin1
 * @summary 텍스트에서 검색어와 일치하는 부분을 하이라이트 처리하는 함수
 * @param text 원본 텍스트
 * @param highlight 하이라이트할 검색어
 * @returns 하이라이트 처리된 JSX.Element
 */
const HighlightedText = ({
  text,
  highlight
}: {
  text: string
  highlight: string
}): React.JSX.Element => {
  // regex 오류를 피하기 위한 몸부림
  const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const trimmedHighlight = highlight.trim()
  if (!trimmedHighlight) {
    return (
      <>
        {text.split('\n').map((line, i) => (
          <span key={i} className="leading-4.5">
            {line}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        ))}
      </>
    )
  }

  const safeHighlight = escapeRegExp(trimmedHighlight)
  const regex = new RegExp(`(${safeHighlight})`, 'gi')
  const lines = text.split('\n')

  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="leading-4.5">
          {line
            .split(regex)
            .filter(Boolean)
            .map((part, j) => {
              const isMatch = part.toLowerCase() === trimmedHighlight.toLowerCase()
              return isMatch ? (
                <mark key={j} className="bg-yellow-400 text-black rounded-sm">
                  {part}
                </mark>
              ) : (
                <span key={j}>{part}</span>
              )
            })}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

/**
 * @author nahyeongjin1
 * @summary 개별 채팅 메시지 컴포넌트
 * @param message 메시지 데이터
 * @param highlightTerm 검색하고자하는 텍스트
 * @returns JSX.Element
 */
export default function ChatMessage({
  message,
  highlightTerm = ''
}: ChatMessageProps): React.JSX.Element {
  const { sender, content, sql, suggestions } = message

  const isUser = sender === 'user'
  const isSystem = sender === 'system'

  if (isSystem) {
    return (
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
          <HighlightedText text={content} highlight={highlightTerm} />
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
      className={cn(
        'self-stretch flex flex-col justify-start gap-3',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      {!isUser && (
        <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
          <HighlightedText text={content} highlight={highlightTerm} />
        </div>
      )}
      {isUser && (
        <div className="w-fit max-w-md px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 inline-flex justify-center items-center gap-2.5">
          <div className="flex justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
            <HighlightedText text={content} highlight={highlightTerm} />
          </div>
        </div>
      )}
      {sql && (
        <div className="self-stretch p-4 bg-zinc-900 rounded-lg flex flex-col justify-start items-end gap-4">
          <div className="self-stretch justify-start text-neutral-200 text-sm font-normal font-['JetBrains_Mono'] leading-tight">
            <HighlightedText text={sql} highlight={highlightTerm} />
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
