import { api } from './api'
import { ApiResponse } from '../types/index'
import {
  ChatTab,
  ChatTabWithMessages,
  ApiChatMessage
} from '@/components/workspace/ai-chat-panel/ai-chat.types'

/**
 * 모든 AI 채팅 탭 목록을 조회합니다.
 */
export const getChatTabs = async (): Promise<ApiResponse<ChatTab[]>> => {
  const response = (await api.get('/api/chatTabs/find')) as ApiResponse<ChatTab[]>
  return response
}

/**
 * 새로운 AI 채팅 탭을 생성합니다.
 * @param name 새 탭의 이름
 */
export const createChatTab = async (name: string): Promise<ApiResponse<ChatTab>> => {
  const response = (await api.post('/api/chatTabs/create', { name })) as ApiResponse<ChatTab>
  return response
}

/**
 * 특정 AI 채팅 탭의 모든 메시지를 조회합니다.
 * @param tabId 메시지를 조회할 탭의 ID
 */
export const getChatTabMessages = async (
  tabId: string
): Promise<ApiResponse<ChatTabWithMessages>> => {
  const response = (await api.get(
    `/api/chatTabs/find/${tabId}`
  )) as ApiResponse<ChatTabWithMessages>
  return response
}

/**
 * 특정 AI 채팅 탭에 메시지를 전송합니다.
 * @param tabId 메시지를 보낼 탭의 ID
 * @param message 보낼 메시지 내용
 */
export const sendMessageToTab = async (
  tabId: string,
  message: string
): Promise<ApiResponse<ApiChatMessage>> => {
  const response = (await api.post('/api/chatMessages/create', {
    chat_tab_id: tabId,
    message
  })) as ApiResponse<ApiChatMessage>
  return response
}

/**
 * 특정 AI 채팅 탭의 이름을 수정합니다.
 * @param tabId 수정할 탭의 ID
 * @param name 새로운 탭 이름
 */
export const updateChatTab = async (tabId: string, name: string): Promise<ApiResponse<ChatTab>> => {
  const response = (await api.put(`/api/chatTabs/modify/${tabId}`, {
    name
  })) as ApiResponse<ChatTab>
  return response
}

/**
 * 특정 AI 채팅 탭을 삭제합니다.
 * @param tabId 삭제할 탭의 ID
 */
export const deleteChatTab = async (tabId: string): Promise<ApiResponse<null>> => {
  const response = (await api.delete(`/api/chatTabs/remove/${tabId}`)) as ApiResponse<null>
  return response
}
