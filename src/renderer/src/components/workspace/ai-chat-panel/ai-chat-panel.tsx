import { useState, useRef, useEffect } from 'react'
import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import ChatMessage from './chat-message'
import { Sparkles } from 'lucide-react'
import TypingLoadingAnimation from './typing-loading-animation'
import { getChatTabMessages, sendMessageToTab } from '../../../utils/chatApi'
import { Message } from '@ai-sdk/react'

const initialSuggestions = [
  '가장 많이 팔린 상품 5개 보여줘',
  '지난달 매출 총액은 얼마야?',
  '고객별 주문 횟수를 내림차순으로 정렬해줘'
]

const systemMessage: Message = {
  id: '1',
  role: 'system',
  content: '안녕하세요!\n자연어로 데이터베이스에 질문하시면 SQL 쿼리를 자동으로 생성해드립니다.'
}

/**
 * @author nahyeongjin1
 * @summary AI 질의 화면
 * @returns JSX.Element
 */
export default function AiChatPanel(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([systemMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // TODO: 컴포넌트 마운트 시 가장 최근 탭을 활성화하거나, 탭이 없으면 새로 생성하는 로직 추가
  }, [])

  const handleSelectChat = async (tabId: string): Promise<void> => {
    setActiveTabId(tabId)
    setIsLoading(true)
    try {
      const response = await getChatTabMessages(tabId)
      if (response && response.data && response.data.messages) {
        const fetchedMessages: Message[] = response.data.messages.map((msg) => ({
          id: msg.id,
          role: msg.sender === 'U' ? 'user' : 'assistant',
          content: msg.message
        }))
        setMessages([systemMessage, ...fetchedMessages])
      } else {
        setMessages([systemMessage])
      }
    } catch (error) {
      console.error('채팅 메시지를 불러오는 데 실패했습니다:', error)
      setMessages([systemMessage]) // 에러 발생 시 초기 메시지만 표시
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string): void => {
    setInput(suggestion)
    textareaRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!input.trim() || !activeTabId) return

    const userMessage: Message = {
      id: `${Date.now()}`,
      role: 'user',
      content: input.trim()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendMessageToTab(activeTabId, userMessage.content)
      if (response && response.data) {
        const aiMessage: Message = {
          id: response.data.id,
          role: 'assistant',
          content: response.data.message
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('메시지 전송에 실패했습니다:', error)
      // TODO: 사용자에게 에러 알림 표시
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: '메시지 전송에 실패했습니다. 다시 시도해주세요.'
      }
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]) // 낙관적 업데이트 롤백
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 h-full bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
      <ChatHeader onSearchChange={setSearchTerm} onSelectChat={handleSelectChat} />
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
        {isLoading && <TypingLoadingAnimation className="h-12" />}
      </div>
      <form onSubmit={handleSubmit}>
        <ChatInput
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          isLoading={isLoading}
          disabled={isLoading || !activeTabId}
        />
      </form>
    </div>
  )
}
