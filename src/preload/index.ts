import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { CustomAPI } from './index.d'

// Custom APIs for renderer
const api: CustomAPI = {
  versions: process.versions,
  send: <T = unknown>(channel: string, data?: T) => {
    const validChannels = ['open-sub-window', 'ping', 'open-external', 'save-sql', 'save-csv']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  closeCurrentWindow: () => ipcRenderer.send('close-current-window'),
  // For useChat hook
  invoke: <T>(channel: string, ...args: unknown[]): Promise<T> => {
    const validChannels = ['chat:completion']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    // Return a resolved promise with a value that matches the generic type T
    return Promise.resolve(undefined as T)
  },
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
    const validChannels = ['chat:completion-stream-chunk', 'chat:completion-stream-end']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, listener)
      // Return a cleanup function
      return () => {
        ipcRenderer.removeListener(channel, listener)
      }
    }
    // Add a return path for invalid channels
    return () => {}
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
