import {
  X,
  Table2,
  KeyRound,
  Link,
  Database,
  Calendar,
  Hash,
  Type,
  Check,
  LucideProps,
  Diamond
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TableNodeData } from './table-node'

// 사이드바 상태
interface TableDetailSidebarProps {
  isOpen: boolean
  onClose: () => void
  tableData: TableNodeData | null
}

// TODO: 테이블과 제약 조건 아이콘 통일
const constraintIcons = {
  primary: KeyRound,
  foreign: Link,
  'not-null': Diamond,
  nullable: Diamond,
  unique: Hash,
  index: Database
} as const

// 제약 조건들 색상
const constraintColors = {
  primary: 'text-purple-400 bg-purple-400/10',
  foreign: 'text-blue-400 bg-blue-400/10',
  'not-null': 'text-gray-400 bg-gray-400/10',
  nullable: 'text-gray-500 bg-gray-500/10',
  unique: 'text-green-400 bg-green-400/10',
  index: 'text-yellow-400 bg-yellow-400/10'
} as const

// 제약 조건 표시
const constraintLabels = {
  primary: 'Primary Key',
  foreign: 'Foreign Key',
  'not-null': 'Not Null',
  nullable: 'Nullable',
  unique: 'Unique',
  index: 'Index'
} as const

// 속성 타입에 따라서 아이콘 전달
const getTypeIcon = (
  type: string
): React.ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
> => {
  if (type.includes('VARCHAR') || type.includes('TEXT')) return Type
  if (type.includes('INT') || type.includes('BIGINT')) return Hash
  if (type.includes('TIMESTAMP') || type.includes('DATE')) return Calendar
  return Database
}

// 속성 타입에 따라서 색상 전달

const getTypeColor = (type: string): string => {
  if (type.includes('VARCHAR') || type.includes('TEXT')) return 'text-green-400'
  if (type.includes('INT') || type.includes('BIGINT')) return 'text-blue-400'
  if (type.includes('TIMESTAMP') || type.includes('DATE')) return 'text-purple-400'
  if (type.includes('BOOLEAN')) return 'text-orange-400'
  return 'text-gray-400'
}

/**
 * 테이블 선택 시 오른쪽에 랜더링 되는 사이드바 (어노테이션)
 *
 * @author 6-keem
 * @param isOpen 열림 상태
 * @param onClose 닫기 콜백 함수
 * @param tableData 현재 선택된 테이블 데이터
 * @returns JSX.Element
 */
export function TableDetailSidebar({
  isOpen,
  onClose,
  tableData
}: TableDetailSidebarProps): React.JSX.Element {
  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 z-50 w-96 bg-genie-900 border-l border-genie-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {tableData && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-genie-700">
              <div className="flex items-center gap-2">
                <Table2 className="w-5 h-5 text-primary-light" />
                <h2 className="text-lg font-semibold text-white">{tableData.tableName}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-genie-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                      Table Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-genie-800 rounded-lg p-3">
                        <div className="text-2xl font-bold text-white">
                          {tableData.columns.length}
                        </div>
                        <div className="text-xs text-gray-400">Columns</div>
                      </div>
                      <div className="bg-genie-800 rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary-light">
                          {
                            tableData.columns.filter((col) => col.constraints.includes('primary'))
                              .length
                          }
                        </div>
                        <div className="text-xs text-gray-400">Primary Keys</div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-genie-700" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                      Columns
                    </h3>
                    <div className="space-y-2">
                      {tableData.columns.map((column, index) => {
                        const TypeIcon = getTypeIcon(column.type)
                        const typeColor = getTypeColor(column.type)

                        return (
                          <div key={index} className="bg-genie-800 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TypeIcon className={`w-4 h-4 ${typeColor}`} />
                                <span className="font-medium text-white">{column.name}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs border-genie-700 text-gray-400"
                              >
                                {column.type}
                              </Badge>
                            </div>
                            {column.description !== null && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="font-normal text-genie-200">
                                    {column.description}
                                  </span>
                                </div>
                              </div>
                            )}

                            {column.constraints.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {column.constraints.map((constraint) => {
                                  const IconComponent =
                                    constraintIcons[constraint as keyof typeof constraintIcons]
                                  const colorClass =
                                    constraintColors[constraint as keyof typeof constraintColors]
                                  const label =
                                    constraintLabels[constraint as keyof typeof constraintLabels]

                                  if (!IconComponent) return null

                                  return (
                                    <div
                                      key={constraint}
                                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${colorClass}`}
                                      title={label}
                                    >
                                      <IconComponent
                                        className="w-3 h-3"
                                        fill={constraint === 'not-null' ? 'gray' : 'black'}
                                      />
                                      <span>{label}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {(() => {
                    const primaryKeys = tableData.columns.filter((col) =>
                      col.constraints.includes('primary')
                    )
                    const foreignKeys = tableData.columns.filter((col) =>
                      col.constraints.includes('foreign')
                    )
                    const indexes = tableData.columns.filter((col) =>
                      col.constraints.includes('index')
                    )

                    if (
                      primaryKeys.length === 0 &&
                      foreignKeys.length === 0 &&
                      indexes.length === 0
                    ) {
                      return null
                    }

                    return (
                      <>
                        <Separator className="bg-genie-700" />
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                            Keys & Indexes
                          </h3>

                          {primaryKeys.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                                <KeyRound className="w-4 h-4" />
                                Primary Keys
                              </h4>
                              <div className="space-y-1">
                                {primaryKeys.map((col, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm text-gray-300 bg-genie-800 rounded px-3 py-2"
                                  >
                                    <Check className="w-3 h-3 text-yellow-400" />
                                    {col.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {foreignKeys.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
                                <Link className="w-4 h-4" />
                                Foreign Keys
                              </h4>
                              <div className="space-y-1">
                                {foreignKeys.map((col, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm text-gray-300 bg-genie-800 rounded px-3 py-2"
                                  >
                                    <Check className="w-3 h-3 text-blue-400" />
                                    {col.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {indexes.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Indexes
                              </h4>
                              <div className="space-y-1">
                                {indexes.map((col, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm text-gray-300 bg-genie-800 rounded px-3 py-2"
                                  >
                                    <Check className="w-3 h-3 text-purple-400" />
                                    {col.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
