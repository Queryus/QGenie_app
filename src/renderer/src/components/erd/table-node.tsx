import { Handle, Position, type NodeProps } from '@xyflow/react'
import { KeyRound, Link, SquareDashed, Square, Table2 } from 'lucide-react'

export interface TableColumn {
  name: string
  type: string
  constraints: ('primary' | 'not-null' | 'foreign' | 'unique' | 'index' | 'nullable')[]
}

export interface TableNodeData extends Record<string, unknown> {
  tableName: string
  columns: TableColumn[]
}

const constraintIcons = {
  primary: KeyRound,
  foreign: Link,
  'not-null': Square,
  nullable: SquareDashed
}

const constraintColors = {
  primary: 'text-yellow-400',
  foreign: 'text-blue-400',
  'not-null': 'text-gray-600',
  nullable: 'text-gray-400'
}

const getHighestPriorityConstraint = (constraints: string[]): string | null => {
  const priority = ['primary', 'foreign', 'not-null', 'nullable']

  for (const constraint of priority) {
    if (constraints.includes(constraint)) {
      return constraint
    }
  }
  return null
}

export default function TableNode({
  data
}: NodeProps & { data: TableNodeData }): React.JSX.Element {
  return (
    <div
      className="bg-[#272727] border-1 border-[#393939] rounded-md shadow-lg min-w-[250px] 
             hover:border-[#9F73FF] hover:shadow-[0_0_30px_rgba(159,115,255,0.4)] 
             transition-all duration-300"
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#555', width: 8, height: 8 }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#555', width: 8, height: 8 }}
      />

      <div className="flex bg-[#1C1C1C] text-white px-4 py-2 rounded-t-lg font-bold gap-1.5">
        <div className="flex gap-1 w-5">
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
                    <div title={highestConstraint} className="cursor-help">
                      <IconComponent size={14} className={colorClass} />
                    </div>
                  )
                }
                return null
              })()}
            </div>

            <span className="font-medium text-[#E4E4E4] flex-1">{column.name}</span>

            <span className="text-sm text-[#808080]">{column.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
