import { useState, useRef } from 'react'
import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import ChatMessage from './chat-message'
import { useChat } from '@ai-sdk/react'
import { Sparkles } from 'lucide-react'

const initialSuggestions = [
  '가장 많이 팔린 상품 5개 보여줘',
  '지난달 매출 총액은 얼마야?',
  '고객별 주문 횟수를 내림차순으로 정렬해줘'
]

/**
 * @author nahyeongjin1
 * @summary AI 질의 화면
 * @returns JSX.Element
 */
export default function AiChatPanel(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: '/api/chat',
    streamProtocol: 'text', // TODO: AI 팀에서 받아올 때는 data로 변경해야함
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content:
          '안녕하세요!\n자연어로 데이터베이스에 질문하시면 SQL 쿼리를 자동으로 생성해드립니다.'
      }
    ]
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSuggestionClick = (suggestion: string): void => {
    setInput(suggestion)
    textareaRef.current?.focus()
  }

  console.log(messages)

  return (
    <div className="flex-1 h-full bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
      <ChatHeader onSearchChange={setSearchTerm} />
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
        {messages.map((m, index) => (
          <div key={m.id}>
            <ChatMessage message={m} highlightTerm={searchTerm} />
            {m.role === 'system' && index === 0 && (
              <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap mt-3">
                {initialSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-gradient-to-b from-neutral-700 to-zinc-800 rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2 hover:cursor-pointer"
                  >
                    <Sparkles className="size-3 stroke-[#E4E4E4]" />
                    <div className="justify-start text-neutral-200 text-xs font-medium font-['Pretendard'] leading-4.5">
                      {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <ChatInput
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          isLoading={isLoading}
        />
      </form>
    </div>
  )
}
