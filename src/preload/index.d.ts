import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRendererEvent } from 'electron'

interface CustomAPI {
  versions: NodeJS.ProcessVersions
  send: <T = unknown>(channel: string, data?: T) => void
  closeCurrentWindow: () => void
  invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: unknown[]) => void
  ) => (() => void) | undefined
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
