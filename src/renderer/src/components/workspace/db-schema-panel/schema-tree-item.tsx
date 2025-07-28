import { useState } from 'react'
import { ChevronRight, FolderOpen, ListTree, TableProperties } from 'lucide-react'
import { SchemaIconMap, SchemaNode, SchemaTreeItemProps } from './db-schema.types'
import { cn } from '@/lib/utils'

const ICONS: SchemaIconMap = {
  database: TableProperties,
  schema: ListTree,
  folder: FolderOpen,
  table: TableProperties
}

const ICON_COLORS: Record<string, string> = {
  database: 'stroke-[#808080]',
  schema: 'stroke-[#808080]',
  folder: 'stroke-[#73B2FF]',
  table: 'stroke-[#9F73FF]'
}

/**
 * @author nahyeongjin1
 * @summary DB 스키마 트리의 각 항목을 렌더링하는 재귀 컴포넌트
 * @param node 현재 노드 데이터
 * @param level 현재 노드의 깊이 (들여쓰기용)
 * @returns JSX.Element
 */
export default function SchemaTreeItem({
  node,
  level = 0
}: SchemaTreeItemProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  const IconComponent = ICONS[node.type]

  return (
    <div className="self-stretch flex flex-col justify-start items-start">
      <div
        data-state="Default"
        className="self-stretch pr-1 py-1 rounded inline-flex justify-start items-center gap-2"
        style={{ paddingLeft: `${level * 1.5 + 0.25}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="size-3 flex items-center justify-center">
          <ChevronRight
            className={cn(
              `size-3 transition-transform duration-200`,
              isOpen ? 'rotate-90' : '',
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
      {hasChildren && isOpen && (
        <div className="self-stretch flex flex-col justify-start items-start">
          {node.children?.map((childNode: SchemaNode) => (
            <SchemaTreeItem key={childNode.id} node={childNode} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
