export type MessageSender = 'user' | 'ai' | 'system'

export interface ChatMessageData {
  id: string
  sender: MessageSender
  content: string
  sql?: string
  suggestions?: string[]
  timestamp: string
}
