/// <reference types="vite/client" />
import { ElectronAPI } from '@electron-toolkit/preload'

interface Window {
  electron: ElectronAPI
  api: {
    versions: NodeJS.ProcessVersions
    send: <T = unknown>(channel: string, data?: T) => void
    closeCurrentWindow: () => void
    invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>
    on: (
      channel: string,
      listener: (event: import('electron').IpcRendererEvent, ...args: unknown[]) => void
    ) => () => void
  }
}
