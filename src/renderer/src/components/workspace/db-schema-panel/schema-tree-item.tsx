import { ChevronRight, FolderOpen, ListTree, TableProperties } from 'lucide-react'
import { SchemaIconMap, SchemaNode, SchemaTreeItemProps } from './db-schema.types'
import { cn } from '@/lib/utils'

const ICONS: SchemaIconMap = {
  database: TableProperties,
  schema: ListTree,
  table: FolderOpen,
  column: TableProperties
}

const ICON_COLORS: Record<string, string> = {
  database: 'stroke-[#808080]',
  schema: 'stroke-[#808080]',
  table: 'stroke-[#73B2FF]',
  column: 'stroke-[#9F73FF]'
}

/**
 * @author nahyeongjin1
 * @summary DB 스키마 트리의 각 항목을 렌더링하는 재귀 컴포넌트
 * @param node 현재 노드 데이터
 * @param level 현재 노드의 깊이 (들여쓰기용)
 * @param expandedNodes 전체 노드의 펼침/닫힘 상태 객체
 * @param onToggle 노드 펼침/닫힘 상태를 토글하는 함수
 * @returns JSX.Element
 */
export default function SchemaTreeItem({
  node,
  level = 0,
  expandedNodes,
  onToggle
}: SchemaTreeItemProps): React.JSX.Element {
  const isExpanded = expandedNodes[node.id] || false
  const hasChildren = node.children && node.children.length > 0

  const IconComponent = ICONS[node.type]

  const handleToggle = (): void => {
    if (hasChildren) {
      onToggle(node.id)
    }
  }

  return (
    <div className="self-stretch flex flex-col justify-start items-start">
      <div
        data-state="Default"
        className="self-stretch pr-1 py-1 rounded inline-flex justify-start items-center gap-2 cursor-pointer"
        style={{ paddingLeft: `${level * 20 + 4}px` }}
        onClick={handleToggle}
      >
        <div className="size-3 flex items-center justify-center">
          <ChevronRight
            className={cn(
              'size-3 transition-transform duration-200',
              isExpanded ? 'rotate-90' : '',
              hasChildren ? 'stroke-[#808080]' : 'stroke-transparent'
            )}
          />
        </div>
        <div className="size-3 flex items-center justify-center">
          <IconComponent className={`size-3 ${ICON_COLORS[node.type]}`} />
        </div>
        <div className="justify-start h-4 content-center text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
          {node.name}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="self-stretch flex flex-col justify-start items-start">
          {node.children?.map((childNode: SchemaNode) => (
            <SchemaTreeItem
              key={childNode.id}
              node={childNode}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
