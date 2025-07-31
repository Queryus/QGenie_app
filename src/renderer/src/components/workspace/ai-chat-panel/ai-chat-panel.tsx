import { useState } from 'react'
import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import ChatMessage from './chat-message'
import { ChatMessageData } from './ai-chat.types'
import { v4 as uuidv4 } from 'uuid'

// TODO: 실제 채팅 데이터로 교체
const MOCK_CHAT_DATA: ChatMessageData[] = [
  {
    id: '1',
    sender: 'system',
    content: '안녕하세요!\n자연어로 데이터베이스에 질문하시면 SQL 쿼리를 자동으로 생성해드립니다.',
    suggestions: [
      '가장 많이 팔린 상품 5개 보여줘',
      '지난달 매출 총액은 얼마야?',
      '고객별 주문 횟수를 내림차순으로 정렬해줘'
    ],
    timestamp: '2024-07-30T10:00:00Z'
  },
  {
    id: '2',
    sender: 'user',
    content: '가장 많이 팔린 상품 5개를 매출액과 함께 보여줘',
    timestamp: '2024-07-30T10:01:00Z'
  },
  {
    id: '3',
    sender: 'ai',
    content: '가장 많이 팔린 상품 5개를 매출액과 함께 조회하는 쿼리를 생성했습니다.',
    sql: 'SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, p.ProductName ORDER BY total_revenue DESC LIMIT 5;',
    timestamp: '2024-07-30T10:01:05Z'
  }
]

/**
 * @author nahyeongjin1
 * @summary AI 질의 화면
 * @returns JSX.Element
 */
export default function AiChatPanel(): React.JSX.Element {
  const [messages, setMessages] = useState<ChatMessageData[]>(MOCK_CHAT_DATA)
  const [searchTerm, setSearchTerm] = useState('')
  const [input, setInput] = useState('')

  const handleSendMessage = (content: string): void => {
    const userMessage: ChatMessageData = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput('')

    // TODO: 실제 AI API 연결
    // Mock AI Response
    setTimeout(() => {
      const aiMessage: ChatMessageData = {
        id: uuidv4(),
        sender: 'ai',
        content: `"${content}"에 대한 모의 응답입니다.`,
        sql: `SELECT * FROM your_table WHERE condition = 'mock_condition';`,
        timestamp: new Date().toISOString()
      }
      setMessages((prevMessages) => [...prevMessages, aiMessage])
    }, 1000)
  }

  return (
    <div className="flex-1 h-full bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col">
      <ChatHeader onSearchChange={setSearchTerm} />
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            highlightTerm={searchTerm}
            onSuggestionClick={setInput}
          />
        ))}
      </div>
      <ChatInput value={input} onChange={setInput} onSendMessage={handleSendMessage} />
    </div>
  )
}
