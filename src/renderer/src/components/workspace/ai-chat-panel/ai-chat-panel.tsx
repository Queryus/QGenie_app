import { useState, useRef, useEffect, useCallback } from 'react'
import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import ChatMessage from './chat-message'
import { Sparkles } from 'lucide-react'
import TypingLoadingAnimation from './typing-loading-animation'
import { getChatTabs, createChatTab, getChatTabMessages } from '../../../utils/chatApi'
import { Message, useChat } from '@ai-sdk/react'
import { ChatTab } from './ai-chat.types'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

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

export default function AiChatPanel(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [activeTabName, setActiveTabName] = useState<string>('AI 채팅')
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const initialized = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, setMessages, setInput } = useChat({
    // 스트리밍이 아닌 수동 데이터 처리를 위해 api, body, onFinish 등을 제거
    onError: (error) => {
      // 이 onError는 이제 useChat 내부 로직과 관련 없으므로,
      // handleSubmit에서 직접 에러를 처리하는 것이 더 명확합니다.
      console.error('useChat에서 예상치 못한 에러:', error)
      toast.error('채팅 처리 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  })

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

  const handleSelectChat = useCallback(
    async (tab: ChatTab): Promise<void> => {
      setActiveTabId(tab.id)
      setActiveTabName(tab.name)
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
      }
    },
    [setMessages]
  )

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initializeChat = async (): Promise<void> => {
      try {
        const tabsResponse = await getChatTabs()
        let targetTab: ChatTab | null = null
        let isNewTab = false

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
            isNewTab = true
          }
        }

        if (targetTab) {
          if (isNewTab) {
            setActiveTabId(targetTab.id)
            setActiveTabName(targetTab.name)
            setMessages([systemMessage])
          } else {
            await handleSelectChat(targetTab)
          }
        }
      } catch (error) {
        console.error('초기 채팅 설정에 실패했습니다:', error)
      }
    }

    void initializeChat()
  }, [handleSelectChat, setMessages])

  useEffect(() => {
    const currentActiveTab = chatTabs.find((tab) => tab.id === activeTabId)
    if (currentActiveTab && currentActiveTab.name !== activeTabName) {
      setActiveTabName(currentActiveTab.name)
    }
  }, [chatTabs, activeTabId, activeTabName])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!input.trim() || !activeTabId) return

    const userMessage: Message = { id: uuidv4(), role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await window.api.invoke<{ message?: string; error?: string }>(
        'chat:completion',
        {
          // 중요: AI에게 컨텍스트를 제공하기 위해 이전 메시지들을 함께 보냅니다.
          messages: [...messages, userMessage],
          chatTabId: activeTabId
        }
      )

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.message) {
        const aiMessage: Message = { id: uuidv4(), role: 'assistant', content: result.message }
        setMessages((prevMessages) => [...prevMessages, aiMessage])
      } else {
        throw new Error('Invalid response from main process')
      }
    } catch (error) {
      console.error('AI 응답 처리 실패:', error)
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'AI 응답을 처리하는 데 실패했습니다.'
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
      toast.error('AI 응답을 처리하는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string): void => {
    setInput(suggestion)
    textareaRef.current?.focus()
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
          onChange={handleInputChange}
          isLoading={isLoading}
          disabled={isLoading || !activeTabId}
        />
      </form>
    </div>
  )
}
