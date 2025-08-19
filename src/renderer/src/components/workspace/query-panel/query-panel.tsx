import React, { useState } from 'react'
import { Code2, ChartColumn, Download, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import QueryEditor from './query-editor'
import QueryResults, { type QueryResultData } from './query-results'

type ActiveTab = 'editor' | 'results'

// Mock API function
const executeQuery = async (query: string): Promise<QueryResultData> => {
  console.log('Executing query:', query)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success/error randomly
      if (Math.random() > 0.3) {
        resolve({
          columns: ['id', 'name', 'email', 'age'],
          rows: [
            [1, 'Alice', 'alice@example.com', 30],
            [2, 'Bob', 'bob@example.com', 25],
            [3, 'Charlie', 'charlie@example.com', 35],
            [4, 'David', 'david@example.com', 28]
          ]
        })
      } else {
        reject(new Error("Syntax error near 'FROM'. Check your SQL syntax."))
      }
    }, 1500)
  })
}

/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 및 결과 탭 패널
 * @returns JSX.Element
 */
export default function QueryPanel(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor')
  const [query, setQuery] = useState(
    'SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, p.ProductName ORDER BY total_revenue DESC LIMIT 5;'
  )
  const [result, setResult] = useState<QueryResultData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExecuteQuery = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const queryResult = await executeQuery(query)
      setResult(queryResult)
      setActiveTab('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      setResult(null)
      setActiveTab('results')
    } finally {
      setIsLoading(false)
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
      onClick={() => setActiveTab(tabName)}
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
    <div className="flex-1 h-full flex flex-col bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700">
      <div className="flex justify-between items-center border-b border-neutral-700 pr-3 pl-4">
        <div className="flex gap-6 px-1">
          <TabButton tabName="editor" Icon={Code2} label="쿼리 편집기" />
          <TabButton tabName="results" Icon={ChartColumn} label="실행 결과" />
        </div>
        <div className="flex items-center gap-2">
          {activeTab == 'editor' ? (
            <button
              onClick={handleExecuteQuery}
              disabled={isLoading}
              className={cn(
                'flex items-center gap-2 bg-gradient-genie-gray rounded-lg px-3 py-1.5 outline-1 outline-white/20 outline-offset-[-1px]',
                isLoading ? '' : 'cursor-pointer'
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
          <div className="px-3 py-1.5 bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2 cursor-pointer">
            <Download className="size-3 stroke-genie-100" />
            <div className="justify-start text-genie-100 text-button font-pretendard">내보내기</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab === 'editor' && <QueryEditor query={query} setQuery={setQuery} />}
        {activeTab === 'results' && (
          <QueryResults result={result} isLoading={isLoading} error={error} />
        )}
      </div>
    </div>
  )
}
