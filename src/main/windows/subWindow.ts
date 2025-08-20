import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'

let subWindow: BrowserWindow | null = null

type SubWindowOptions = {
  width: number
  height: number
  parent?: BrowserWindow
  route?: string
  modal?: boolean
}

/**
 * 모달 생성 함수
 *
 * @param width  모달 가로 크기
 * @param height 모달 세로 크기
 * @param route  라우팅 경로 (App.tsx 내 Routes 참고)
 *
 * @author 6-keem
 *
 * @example
 * // 600x400 크기의 모달 '/connection-wizard' 경로로 열기
 * createSubWindow(600, 400, '/connection-wizard')
 */
export function createSubWindow({
  width,
  height,
  parent,
  route,
  modal = true
}: SubWindowOptions): void {
  if (subWindow) {
    subWindow.focus()
    return
  }

  subWindow = new BrowserWindow({
    width,
    height,
    parent,
    modal: modal,
    show: false,
    resizable: true,
    minWidth: width,
    minHeight: height,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  subWindow.on('ready-to-show', () => {
    subWindow?.show()
  })

  subWindow.on('closed', () => {
    subWindow = null
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    subWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`)
  } else {
    subWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: route
    })
  }
}
