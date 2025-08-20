import { Message as VercelMessage } from '@ai-sdk/react'

export type MessageSender = 'user' | 'ai' | 'system'

export interface ChatMessageData {
  id: string
  sender: MessageSender
  content: string
  sql?: string
  suggestions?: string[]
  timestamp: string
}

// API 응답 타입을 위한 인터페이스
export interface ChatTab {
  name: string
  id: string
  created_at: string
  updated_at: string
}

export interface ApiChatMessage {
  name: string
  id: string
  chat_tab_id: string
  sender: 'U' | 'A' // User or AI
  message: string
  created_at: string
  updated_at: string
}

export interface ChatTabWithMessages extends ChatTab {
  messages: ApiChatMessage[]
}

// Vercel AI SDK의 Message 타입과 우리 API의 메시지 타입을 합칩니다.
// VercelMessage와 이름 충돌을 피하기 위해 Message로 export
export type Message = VercelMessage
export type UnifiedMessage = Message | ApiChatMessage
