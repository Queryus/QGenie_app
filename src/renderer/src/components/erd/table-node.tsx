import type React from 'react'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  KeyRound,
  Link,
  SquareDashedBottomIcon as SquareDashed,
  Square,
  Table2
} from 'lucide-react'

export interface TableColumn {
  name: string
  type: string
  constraints: ('primary' | 'not-null' | 'foreign' | 'unique' | 'index' | 'nullable')[]
}

export interface TableNodeData extends Record<string, unknown> {
  tableName: string
  columns: TableColumn[]
  isHighlighted?: boolean
}

const constraintIcons = {
  primary: KeyRound,
  foreign: Link,
  'not-null': Square,
  nullable: SquareDashed
} as const

const constraintColors = {
  primary: 'text-yellow-400',
  foreign: 'text-blue-400',
  'not-null': 'text-gray-600',
  nullable: 'text-gray-400'
} as const

const getHighestPriorityConstraint = (
  constraints: string[]
): keyof typeof constraintIcons | null => {
  const priority: (keyof typeof constraintIcons)[] = ['primary', 'foreign', 'not-null', 'nullable']

  for (const constraint of priority) {
    if (constraints.includes(constraint)) {
      return constraint
    }
  }
  return null
}

export default function TableNode(props: NodeProps & { data: TableNodeData }): React.JSX.Element {
  const { data, id } = props

  const handleMouseEnter = (): void => {
    const event = new CustomEvent('nodeHover', {
      detail: { nodeId: id, isHovering: true }
    })
    window.dispatchEvent(event)
  }

  const handleMouseLeave = (): void => {
    const event = new CustomEvent('nodeHover', {
      detail: { nodeId: id, isHovering: false }
    })
    window.dispatchEvent(event)
  }

  const getNodeStyles = (): string => {
    if (data.isHighlighted) {
      return 'bg-[#272727] border-1 border-[#9F73FF] rounded-md shadow-lg min-w-[250px] transition-all duration-200'
    }
    return 'bg-[#272727] border border-[#393939] rounded-md shadow-lg min-w-[250px] hover:border-[#9F73FF] hover:shadow-[0_0_20px_rgba(159,115,255,0.4)] transition-all duration-200'
  }

  const getGlowStyle = (): React.CSSProperties => {
    if (data.isHighlighted) {
      return {
        boxShadow: '0 0 40px rgba(159, 115, 255, 0.4)'
      }
    }
    return {}
  }

  return (
    <div
      className={getNodeStyles()}
      style={getGlowStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 좌측 Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#555', width: 8, height: 8 }}
      />

      {/* 우측 Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#555', width: 8, height: 8 }}
      />

      {/* 테이블 헤더 */}
      <div className="flex bg-[#454545] text-white px-4 py-2 rounded-t-lg font-bold gap-1.5">
        <div className="flex w-5">
          <Table2 />
        </div>
        {data.tableName}
      </div>

      {/* 속성들 */}
      <div>
        {data.columns.map((column, index) => (
          <div
            key={index}
            className="px-4 py-2 flex items-center gap-1.5 hover:bg-[#454545] transition duration-300"
          >
            {/* 제약 조건 아이콘 */}
            <div className="flex gap-1 w-5">
              {(() => {
                const highestConstraint = getHighestPriorityConstraint(column.constraints)
                if (highestConstraint && constraintIcons[highestConstraint]) {
                  const IconComponent = constraintIcons[highestConstraint]
                  const colorClass = constraintColors[highestConstraint]
                  return (
                    <div title={highestConstraint} className="cursor-help">
                      <IconComponent size={14} className={colorClass} />
                    </div>
                  )
                }
                return null
              })()}
            </div>

            {/* 속성명 */}
            <span className="font-medium text-[#E4E4E4] flex-1">{column.name}</span>

            <span
              className={`text-sm text-[#808080] transition-all duration-300 overflow-hidden inline-block ${
                data.isHighlighted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {column.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
