import { BrowserWindow, ipcMain, shell, dialog } from 'electron'
import fs from 'fs'
import { createSubWindow } from '../windows/subWindow'
import axios from 'axios'
import { getMainWindow } from '../windows/mainWindow'

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

  // 연결 목록 업데이트 신호 중계
  ipcMain.on('connections-updated', () => {
    const mainWindow = getMainWindow()
    if (mainWindow) {
      mainWindow.webContents.send('connections-updated')
    }
  })

  // 파일 저장 핸들러: SQL
  ipcMain.on('save-sql', async (_event, sqlContent: string) => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return

    const { filePath } = await dialog.showSaveDialog(window, {
      title: 'Save SQL File',
      defaultPath: `query-${Date.now()}.sql`,
      filters: [{ name: 'SQL Files', extensions: ['sql'] }]
    })

    if (filePath) {
      try {
        fs.writeFileSync(filePath, sqlContent, 'utf-8')
        console.log('SQL file saved to:', filePath)
      } catch (err) {
        console.error('Failed to save SQL file:', err)
      }
    }
  })

  // 파일 저장 핸들러: CSV
  ipcMain.on('save-csv', async (_event, csvContent: string) => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return

    const { filePath } = await dialog.showSaveDialog(window, {
      title: 'Save CSV File',
      defaultPath: `results-${Date.now()}.csv`,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    })

    if (filePath) {
      try {
        // CSV 파일에 BOM을 추가하여 Excel에서 한글이 깨지지 않도록 함
        const BOM = '\uFEFF'
        fs.writeFileSync(filePath, BOM + csvContent, 'utf-8')
        console.log('CSV file saved to:', filePath)
      } catch (err) {
        console.error('Failed to save CSV file:', err)
      }
    }
  })

  // Vercel AI SDK 'useChat' 훅을 위한 핸들러 (스트리밍 시뮬레이션)
  ipcMain.handle('chat:completion', async (event, { messages, chatTabId }) => {
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

      // 1. 백엔드로부터 완전한 응답을 받습니다.
      const response = await axios.post(
        'http://localhost:39722/api/chatMessages/create',
        requestBody
      )

      console.log('Backend response data:', JSON.stringify(response.data, null, 2))

      if (response.data && response.data.data) {
        const aiMessage = response.data.data.message as string

        // 2. 받은 메시지를 한 글자씩 쪼개서 짧은 딜레이와 함께 전송합니다.
        for (const char of aiMessage) {
          event.sender.send('chat:completion-stream-chunk', char)
          await new Promise((resolve) => setTimeout(resolve, 30)) // 30ms 딜레이
        }

        // 3. 스트림 종료를 알립니다.
        event.sender.send('chat:completion-stream-end')
        return { success: true }
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('AI 응답 요청 실패:', error)
      event.sender.send('chat:completion-stream-end') // 실패 시에도 종료 이벤트 전송
      return { error: 'Failed to get AI response' }
    }
  })
}
