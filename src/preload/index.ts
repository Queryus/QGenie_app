import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  versions: process.versions,
  send: <T = unknown>(channel: string, data?: T) => {
    const validChannels = ['open-sub-window', 'ping', 'open-external']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  closeCurrentWindow: () => ipcRenderer.send('close-current-window'),
  // For useChat hook
  invoke: (channel: string, ...args: unknown[]) => {
    const validChannels = ['chat:completion']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    return Promise.resolve(undefined) // Add a return path for invalid channels
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
