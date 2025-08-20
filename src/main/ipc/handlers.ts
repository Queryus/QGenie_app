import { BrowserWindow, ipcMain, shell } from 'electron'
import { createSubWindow } from '../windows/subWindow'
import axios from 'axios'

/**
 * NOTE: IPC Handler 한 번에 등록, 관리
 */
export function registerIpcHandlers(mainWindow?: BrowserWindow): void {
  ipcMain.on('ping', () => {
    console.log('pong')
  })

  ipcMain.on('open-external', (_event, url: string) => {
    if (/^(mailto:|http)/.test(url)) {
      shell.openExternal(url)
    }
  })

  ipcMain.on(
    'open-sub-window',
    (_event, options: { width: number; height: number; route: string }) => {
      createSubWindow({
        width: options.width,
        height: options.height,
        parent: mainWindow!,
        route: options.route,
        modal: true
      })
    }
  )

  ipcMain.on('close-current-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  // Vercel AI SDK 'useChat' 훅을 위한 핸들러
  ipcMain.handle('chat:completion', async (_event, { messages, chatTabId }) => {
    if (!chatTabId) {
      return { error: 'chatTabId is required' }
    }

    const userMessage = messages.at(-1)?.content
    if (!userMessage) {
      return { error: 'No user message found' }
    }

    try {
      const requestBody = {
        chat_tab_id: chatTabId,
        message: userMessage
      }
      console.log('Sending request to backend:', JSON.stringify(requestBody, null, 2))

      // API.md에 명시된 API 호출
      const response = await axios.post(
        'http://localhost:39722/api/chatMessages/create',
        requestBody
      )

      // API 응답 형식에 맞춰 AI 메시지 반환
      if (response.data && response.data.data) {
        const aiMessage = response.data.data.message
        return { message: aiMessage }
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('AI 응답 요청 실패:', error)
      return { error: 'Failed to get AI response' }
    }
  })
}
