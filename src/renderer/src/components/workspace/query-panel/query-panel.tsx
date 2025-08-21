import React from 'react'
import { Code2, ChartColumn, Download, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import QueryEditor from './query-editor'
import QueryResults, { type QueryResultData } from './query-results'
import { ConnectionProfile } from '../../../types/database'
import ConnectionSelector from './connection-selector'
import { toast } from 'sonner'

export type { QueryResultData }
export type ActiveTab = 'editor' | 'results'

interface QueryPanelProps {
  // Connection state
  connections: ConnectionProfile[]
  activeConnection: ConnectionProfile | null
  setActiveConnection: (connection: ConnectionProfile | null) => void
  // Query state
  query: string
  setQuery: (query: string) => void
  result: QueryResultData | null
  isLoading: boolean
  error: string | null
  setError: (error: string | null) => void
  // Tab state
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  // Execution handler
  onExecuteQuery: () => Promise<void>
}

/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 및 결과 탭 패널 (상태를 props로 관리)
 * @returns JSX.Element
 */
export function QueryPanel({
  connections,
  activeConnection,
  setActiveConnection,
  query,
  setQuery,
  result,
  isLoading,
  error,
  setError,
  activeTab,
  setActiveTab,
  onExecuteQuery
}: QueryPanelProps): React.JSX.Element {
  const handleTabChange = (tabName: ActiveTab): void => {
    if (tabName === 'editor') {
      setError(null)
    }
    setActiveTab(tabName)
  }

  const handleExport = (): void => {
    if (activeTab === 'editor') {
      if (!query.trim()) {
        toast.info('내보낼 쿼리가 없습니다.')
        return
      }
      window.api.send('save-sql', query)
    } else if (activeTab === 'results') {
      if (!result || result.rows.length === 0) {
        toast.info('내보낼 결과가 없습니다.')
        return
      }

      const { columns, rows } = result
      const header = columns.join(',')
      const body = rows
        .map((row) =>
          row
            .map((cell) => {
              const cellStr = String(cell ?? '')
              if (cellStr.includes(',') || cellStr.includes('"')) {
                return `"${cellStr.replace(/"/g, '""')}"`
              }
              return cellStr
            })
            .join(',')
        )
        .join('\n')

      const csvContent = `${header}\n${body}`
      window.api.send('save-csv', csvContent)
    }
  }

  const TabButton = ({
    tabName,
    Icon,
    label
  }: {
    tabName: ActiveTab
    Icon: React.ElementType
    label: string
  }): React.JSX.Element => (
    <div
      onClick={() => handleTabChange(tabName)}
      className={cn(
        'group flex items-center gap-2 py-[16.5px] cursor-pointer border-b-3 -mb-px',
        activeTab === tabName
          ? 'border-primary-light text-genie-100'
          : 'border-transparent text-genie-500 hover:text-genie-200 hover:opacity-80'
      )}
    >
      <Icon className="size-4 stroke-current" />
      <span className="text-title font-pretendard">{label}</span>
    </div>
  )

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-700 pr-3 pl-4">
        <div className="flex gap-6 px-1">
          <TabButton tabName="editor" Icon={Code2} label="쿼리 편집기" />
          <TabButton tabName="results" Icon={ChartColumn} label="실행 결과" />
        </div>
        <div className="flex items-center gap-2">
          {activeTab == 'editor' ? (
            <button
              onClick={onExecuteQuery}
              disabled={isLoading || !activeConnection}
              className={cn(
                'flex items-center gap-2 bg-gradient-genie-gray rounded-lg px-3 py-1.5 outline-1 outline-white/20 outline-offset-[-1px]',
                isLoading || !activeConnection ? 'opacity-50' : 'cursor-pointer'
              )}
            >
              <Play className="size-4 stroke-genie-100" />
              <span className="text-button text-genie-100 font-pretendard">
                {isLoading ? '실행 중...' : '실행하기'}
              </span>
            </button>
          ) : (
            <></>
          )}
          <div
            onClick={handleExport}
            className="px-3 py-1.5 bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2 cursor-pointer"
          >
            <Download className="size-3 stroke-genie-100" />
            <div className="justify-start text-genie-100 text-button font-pretendard">내보내기</div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-neutral-700">
              <ConnectionSelector
                connections={connections}
                activeConnection={activeConnection}
                setActiveConnection={setActiveConnection}
              />
            </div>
            <QueryEditor query={query} setQuery={setQuery} />
          </div>
        )}
        {activeTab === 'results' && (
          <QueryResults result={result} isLoading={isLoading} error={error} />
        )}
      </div>
    </div>
  )
}
