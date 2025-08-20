import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from '@/components/workspace/main-page'
import { ConnectionWizard } from '@/components/connection-wizard/wizard-modal'
import SettingModal from './components/setting/setting-modal'
import ErdPage from './erd/erd-page'
import { Loading } from './Loading'

function App(): React.JSX.Element {
  const [backendReady, setBackendReady] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)

  useEffect(() => {
    if (window.electron?.ipcRenderer) {
      const handleReady = (): void => setBackendReady(true)
      const handleError = (_: unknown, err: unknown): void => {
        setBackendError(
          err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)
        )
      }

      window.electron.ipcRenderer.once('backend-ready', handleReady)
      window.electron.ipcRenderer.once('backend-error', handleError)

      return () => {
        window.electron.ipcRenderer.removeAllListeners('backend-ready')
        window.electron.ipcRenderer.removeAllListeners('backend-error')
      }
    } else if (process.env.NODE_ENV === 'development') {
      setTimeout(() => setBackendReady(true), 1000)
    }

    return undefined
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            backendError ? (
              <Loading backendError={backendError} />
            ) : backendReady ? (
              <MainPage />
            ) : (
              <Loading backendError={null} />
            )
          }
        />
        <Route path="/erd" element={<ErdPage />} />
        <Route path="/connection-wizard" element={<ConnectionWizard />} />
        <Route path="/setting" element={<SettingModal />} />
      </Routes>
    </HashRouter>
  )
}

export default App
