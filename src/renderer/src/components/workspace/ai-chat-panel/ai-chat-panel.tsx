import { useState, useRef, useEffect } from 'react'
import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import ChatMessage from './chat-message'
import { Sparkles } from 'lucide-react'
import TypingLoadingAnimation from './typing-loading-animation'
import {
  getChatTabMessages,
  sendMessageToTab,
  getChatTabs,
  createChatTab
} from '../../../utils/chatApi'
import { Message } from '@ai-sdk/react'
import { ChatTab } from './ai-chat.types'
import { toast } from 'sonner'

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
  const [activeTabName, setActiveTabName] = useState<string>('AI 채팅')
  const [messages, setMessages] = useState<Message[]>([systemMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const initialized = useRef(false)

  const fetchChatTabs = async (): Promise<void> => {
    try {
      const response = await getChatTabs()
      if (response && response.data) {
        const sortedTabs = response.data.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        setChatTabs(sortedTabs)
      } else {
        setChatTabs([])
      }
    } catch (error) {
      console.error('채팅 탭 목록을 불러오는 데 실패했습니다:', error)
      toast.error('채팅 내역을 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true

    const initializeChat = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const tabsResponse = await getChatTabs()
        let targetTab: ChatTab | null = null

        if (tabsResponse && tabsResponse.data && tabsResponse.data.length > 0) {
          const sortedTabs = tabsResponse.data.sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )
          setChatTabs(sortedTabs)
          targetTab = sortedTabs[0]
        } else {
          const newTabResponse = await createChatTab('새로운 채팅')
          if (newTabResponse && newTabResponse.data) {
            setChatTabs([newTabResponse.data])
            targetTab = newTabResponse.data
          }
        }

        if (targetTab) {
          await handleSelectChat(targetTab)
        }
      } catch (error) {
        console.error('초기 채팅 설정에 실패했습니다:', error)
        setMessages([systemMessage])
      } finally {
        setIsLoading(false)
      }
    }

    void initializeChat()
  }, [])

  useEffect(() => {
    const currentActiveTab = chatTabs.find((tab) => tab.id === activeTabId)
    if (currentActiveTab && currentActiveTab.name !== activeTabName) {
      setActiveTabName(currentActiveTab.name)
    }
  }, [chatTabs, activeTabId, activeTabName])

  const handleSelectChat = async (tab: ChatTab): Promise<void> => {
    setActiveTabId(tab.id)
    setActiveTabName(tab.name)
    setIsLoading(true)

    try {
      const response = await getChatTabMessages(tab.id)
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
      setMessages([systemMessage])
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

    setMessages((prevMessages) => [...prevMessages, userMessage])
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
        setMessages((prevMessages) => [...prevMessages, aiMessage])
      }
    } catch (error) {
      console.error('메시지 전송에 실패했습니다:', error)
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: '메시지 전송에 실패했습니다. 다시 시도해주세요.'
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 h-full bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
      <ChatHeader
        activeTabName={activeTabName}
        onSearchChange={setSearchTerm}
        onSelectChat={handleSelectChat}
        chatTabs={chatTabs}
        refreshChatTabs={fetchChatTabs}
      />
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
