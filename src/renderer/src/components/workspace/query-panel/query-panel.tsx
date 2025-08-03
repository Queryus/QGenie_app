import React, { useState } from 'react'
import { Code2, ChartColumn, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import QueryEditor from './query-editor'
import QueryResults from './query-results'

type ActiveTab = 'editor' | 'results'

/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 및 결과 탭 패널
 * @returns JSX.Element
 */
export default function QueryPanel(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor')

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
      {/* Tab Header */}
      <div className="flex justify-between items-center border-b border-neutral-700 pr-3 pl-4">
        <div className="flex gap-6 px-1">
          <TabButton tabName="editor" Icon={Code2} label="쿼리 편집기" />
          <TabButton tabName="results" Icon={ChartColumn} label="실행 결과" />
        </div>
        <div className="px-3 py-1.5 bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2 cursor-pointer">
          <Download className="size-3 stroke-genie-100" />
          <div className="justify-start text-genie-100 text-button font-pretendard">내보내기</div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'editor' && <QueryEditor />}
        {activeTab === 'results' && <QueryResults />}
      </div>
    </div>
  )
}
