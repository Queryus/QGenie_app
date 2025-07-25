import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TableNode from '@/components/erd/table-node'
import { ErdEdge } from '@/components/erd/custom-edge'

const nodeTypes = {
  table: TableNode
}

const edgeTypes = {
  erd: ErdEdge
}

const initialNodes: Node[] = [
  {
    id: 'users',
    type: 'table',
    position: { x: 100, y: 100 },
    data: {
      tableName: 'users',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'email',
          type: 'VARCHAR(255)',
          constraints: ['not-null', 'unique']
        },
        {
          name: 'name',
          type: 'VARCHAR(100)',
          constraints: ['not-null']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMP',
          constraints: ['nullable']
        }
      ]
    }
  },
  {
    id: 'posts',
    type: 'table',
    position: { x: 500, y: 100 },
    data: {
      tableName: 'posts',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'user_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'index']
        },
        {
          name: 'title',
          type: 'VARCHAR(255)',
          constraints: ['not-null']
        },
        {
          name: 'content',
          type: 'TEXT',
          constraints: []
        },
        {
          name: 'published',
          type: 'BOOLEAN',
          constraints: ['not-null']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        },
        {
          name: 'published_at',
          type: 'TIMESTAMP',
          constraints: ['nullable']
        }
      ]
    }
  },
  {
    id: 'comments',
    type: 'table',
    position: { x: 900, y: 100 },
    data: {
      tableName: 'comments',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'post_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'index']
        },
        {
          name: 'user_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'index']
        },
        {
          name: 'content',
          type: 'TEXT',
          constraints: ['not-null']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        }
      ]
    }
  }
]

const initialEdges: Edge[] = [
  {
    id: 'users-posts',
    source: 'users',
    sourceHandle: 'right',
    target: 'posts',
    targetHandle: 'left',
    type: 'erd'
  },
  {
    id: 'posts-comments',
    source: 'posts',
    sourceHandle: 'right',
    target: 'comments',
    targetHandle: 'left',
    type: 'erd'
  },
  {
    id: 'users-comments',
    source: 'users',
    sourceHandle: 'right',
    target: 'comments',
    targetHandle: 'left',
    type: 'erd',
    style: { strokeDasharray: '5,5' }
  }
]

export default function ErdPage(): React.JSX.Element {
  return (
    <div className="w-full h-screen bg-zinc-900">
      <style>{`
        .react-flow__edge {
          z-index: 10 !important;
        }
        .react-flow__node {
          z-index: 5 !important;
        }
      `}</style>

      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={{ background: '#18181b' }}
      >
        <Controls showInteractive={false} />
        <Background />
      </ReactFlow>
    </div>
  )
}
