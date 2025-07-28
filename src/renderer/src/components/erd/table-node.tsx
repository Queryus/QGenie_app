import type React from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { KeyRound, Link, Diamond, Table2 } from 'lucide-react'

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
  'not-null': Diamond,
  nullable: Diamond
} as const

const constraintColors = {
  primary: 'text-[#9F73FF]',
  foreign: 'text-[#9F73FF]',
  'not-null': 'text-[#808080]',
  nullable: 'text-[#808080]'
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

  const handleClick = (): void => {
    const event = new CustomEvent('nodeClick', {
      detail: { nodeId: id, nodeData: data }
    })
    window.dispatchEvent(event)
  }

  const handleMouseDown = (): void => {
    const event = new CustomEvent('nodeDown', {
      detail: { nodeId: id, nodeData: data }
    })
    window.dispatchEvent(event)
  }

  const getNodeStyles = (): string => {
    if (data.isHighlighted) {
      return 'bg-[#1c1c1c] border-1 border-[#9F73FF] rounded-md shadow-lg min-w-[250px] transition-all duration-200 relative z-10'
    }
    return 'bg-[#1c1c1c] border border-[#393939] rounded-md shadow-lg min-w-[250px] hover:border-[#9F73FF] hover:shadow-[0_0_20px_rgba(159,115,255,0.4)] transition-all duration-200 relative z-10'
  }

  const getGlowStyle = (): React.CSSProperties => {
    if (data.isHighlighted) {
      return {
        boxShadow: '0 0 40px rgba(159, 115, 255, 0.4)'
      }
    }
    return {}
  }

  // 여러 핸들을 생성하는 함수
  const createHandles = (position: Position, side: 'left' | 'right'): React.JSX.Element[] => {
    const handles: React.JSX.Element[] = []
    const handleCount = 4 // 각 면에 4개의 핸들

    for (let i = 0; i < handleCount; i++) {
      const handleId = `${side}-${i + 1}`
      const percentage = ((i + 1) / (handleCount + 1)) * 100 // 균등하게 분배

      let style: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        width: 1,
        height: 1,
        zIndex: 1000,
        opacity: 0
      }

      if (position === Position.Left) {
        style = { ...style, left: -1, top: `${percentage}%` }
      } else if (position === Position.Right) {
        style = { ...style, right: -1, top: `${percentage}%` }
      }

      handles.push(
        <Handle
          key={handleId}
          type={position === Position.Left ? 'target' : 'source'}
          position={position}
          id={handleId}
          style={style}
        />
      )
    }
    return handles
  }

  return (
    <div
      className={getNodeStyles()}
      style={getGlowStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDownCapture={handleMouseDown}
      onClick={handleClick}
    >
      {createHandles(Position.Left, 'left')}

      {createHandles(Position.Right, 'right')}

      <div className="flex bg-[#272727] text-white px-4 py-2 rounded-t-lg font-bold gap-1.5">
        <div className="flex w-5">
          <Table2 />
        </div>
        {data.tableName}
      </div>

      <div>
        {data.columns.map((column, index) => (
          <div
            key={index}
            className="px-4 py-2 flex items-center gap-1.5 hover:bg-[#454545] transition duration-300"
          >
            <div className="flex gap-1 w-5">
              {(() => {
                const highestConstraint = getHighestPriorityConstraint(column.constraints)
                if (highestConstraint && constraintIcons[highestConstraint]) {
                  const IconComponent = constraintIcons[highestConstraint]
                  const colorClass = constraintColors[highestConstraint]
                  return (
                    <div title={highestConstraint}>
                      <IconComponent
                        size={14}
                        className={colorClass}
                        fill={`${highestConstraint === 'not-null' && '#808080'}`}
                      />
                    </div>
                  )
                }
                return null
              })()}
            </div>

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
