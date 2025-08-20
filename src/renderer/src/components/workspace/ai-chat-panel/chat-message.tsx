import { Copy, Play, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Message } from '@ai-sdk/react'

interface ChatMessageProps {
  message: Message
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
                <mark key={j} className="bg-violet-500/80 text-violet-100 rounded-sm">
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
  const { role, content } = message

  const isUser = role === 'user'
  const isSystem = role === 'system'
  const isAi = role === 'assistant'

  // : content에서 SQL 부분만 추출 (실제로는 더 정교한 파싱 필요)
  const sqlMatch = content.match(/```sql\n([\s\S]*?)\n```/)
  const mainContent = sqlMatch ? content.replace(sqlMatch[0], '').trim() : content

  const sql = sqlMatch ? sqlMatch[1].trim() : null

  if (isSystem) {
    return (
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-none">
          <HighlightedText text={content} highlight={highlightTerm} />
        </div>
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
      {(isAi || isUser) && (
        <div
          className={cn(
            "w-fit max-w-md px-3 py-1.5 rounded-lg text-xs font-medium font-['Pretendard'] leading-none text-neutral-200",
            isUser
              ? 'bg-gradient-to-b from-neutral-700 to-zinc-800 outline-1 outline-offset-[-1px] outline-white/20'
              : 'bg-zinc-900', // AI 메시지 배경색 추가
            // 내용과 SQL이 모두 없을 때만 최소 높이를 적용
            !mainContent && !sql ? 'min-h-[20px]' : ''
          )}
        >
          {mainContent && <HighlightedText text={mainContent} highlight={highlightTerm} />}
        </div>
      )}
      {sql && (
        <div className="self-stretch p-4 bg-zinc-900 rounded-lg flex flex-col justify-start items-end gap-4">
          <div className="self-stretch justify-start text-genie-100 text-code font-code">
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
