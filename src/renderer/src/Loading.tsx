import { JSX } from 'react'

interface LoadingProps {
  backendError: string | null
}

export function Loading({ backendError }: LoadingProps): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-genie-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 bg-primary-light mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-300 mb-2">QGenie 시작 중...</h2>
        <p className="text-gray-400 mb-4">백엔드 서비스를 초기화하고 있습니다.</p>
        {backendError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-700 text-sm">오류가 발생했습니다: {backendError}</p>
          </div>
        )}
      </div>
    </div>
  )
}
