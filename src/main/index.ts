import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow, getMainWindow } from './windows/mainWindow'
import { registerIpcHandlers } from './ipc/handlers'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import os from 'os'
import waitOn from 'wait-on'
import fs from 'fs'
import net from 'net'

let apiProcess: ChildProcess | null = null
let aiProcess: ChildProcess | null = null

app.disableHardwareAcceleration()

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.Queryus.QGenie')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))

  createMainWindow()
  registerIpcHandlers()

  console.log('NODE_ENV in main process:', process.env.NODE_ENV)

  getMainWindow()?.webContents.openDevTools()
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      getMainWindow()?.webContents.send('backend-ready', { apiPort: 39722 })
    }, 1000)
  } else {
    try {
      console.log('Starting backend services...')
      await startBackendServices()
      getMainWindow()?.webContents.send('backend-ready', { apiPort: 39722 })
    } catch (err) {
      console.error('Backend startup failed:', err)
      getMainWindow()?.webContents.send('backend-error', err || 'Unknown error')
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', async () => {
  console.log('Shutting down backend services...')
  const shutdownPromises: Promise<void>[] = []

  const killProcess = (proc: ChildProcess | null, name: string): Promise<void> =>
    new Promise<void>((resolve) => {
      if (!proc) return resolve()
      proc.kill('SIGTERM')
      const timeout = setTimeout(() => {
        if (!proc.killed) proc.kill('SIGKILL')
        resolve()
      }, 5000)
      proc.on('exit', () => {
        clearTimeout(timeout)
        console.log(`${name} exited`)
        resolve()
      })
    })

  shutdownPromises.push(killProcess(apiProcess, 'API'))
  shutdownPromises.push(killProcess(aiProcess, 'AI'))

  await Promise.all(shutdownPromises)
  console.log('All backend services stopped')
})

// 포트 사용 여부 확인
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(port, () => server.close(() => resolve(false)))
    server.on('error', () => resolve(true))
  })
}

// API 헬스 체크
async function checkApiHealth(port: number, maxRetries = 10): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`)
      if (res.ok) return true
    } catch {
      continue
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}

// 리소스 경로
function getResourcePath(): string {
  if (process.env.NODE_ENV === 'development') return path.join(__dirname, '../../resources')
  if (process.resourcesPath) return path.join(process.resourcesPath, 'resources')
  return path.join(process.cwd(), 'resources')
}

// 백엔드 시작
async function startBackendServices(): Promise<void> {
  const platform = os.platform()
  const basePath = getResourcePath()
  const apiPort = 39722

  let apiPath: string
  let aiPath: string

  if (platform === 'win32') {
    apiPath = path.join(basePath, 'win', 'qgenie-api.exe')
    aiPath = path.join(basePath, 'win', 'qgenie-ai.exe')
  } else if (platform === 'darwin') {
    apiPath = path.join(basePath, 'mac', 'qgenie-api')
    aiPath = path.join(basePath, 'mac', 'qgenie-ai')
  } else {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  if (!fs.existsSync(apiPath)) throw new Error(`API executable not found: ${apiPath}`)
  if (!fs.existsSync(aiPath)) throw new Error(`AI executable not found: ${aiPath}`)

  if (platform === 'darwin') {
    fs.chmodSync(apiPath, 0o755)
    fs.chmodSync(aiPath, 0o755)
  }

  const portInUse = await isPortInUse(apiPort)
  if (portInUse && (await checkApiHealth(apiPort))) {
    console.log('Existing API server healthy, skipping startup')
  } else {
    await new Promise<void>((resolve, reject) => {
      console.log('Spawning API process:', apiPath)
      apiProcess = spawn(apiPath, [`--port=${apiPort}`], {
        cwd: path.dirname(apiPath),
        stdio: 'inherit'
      })
      apiProcess.on('error', (err) => reject(err))
      apiProcess.on('exit', (code) =>
        code !== 0 ? reject(new Error(`API exited with ${code}`)) : resolve()
      )

      // 포트 열림 감지
      const waitOpts = { resources: [`tcp:127.0.0.1:${apiPort}`], timeout: 30000 }
      waitOn(waitOpts)
        .then(() => checkApiHealth(apiPort))
        .then((healthy) => (healthy ? resolve() : reject(new Error('API failed health check'))))
        .catch(reject)
    })
  }

  // AI 시작
  console.log('Spawning AI process:', aiPath)
  aiProcess = spawn(aiPath, [], { cwd: path.dirname(aiPath), stdio: 'inherit' })
  aiProcess.on('error', (err) => console.error('AI spawn error:', err))
}
