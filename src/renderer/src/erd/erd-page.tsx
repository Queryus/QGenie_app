import type React from 'react'

import { ErdEdge } from '@/components/erd/custom-edge'
import TableNode from '@/components/erd/table-node'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useCallback } from 'react'

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
  }
]

export default function ErdPage(): React.JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const handleNodeHover = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<{ nodeId: string; isHovering: boolean }>
      const { nodeId, isHovering } = customEvent.detail

      if (isHovering) {
        // 연결된 노드와 엣지 찾기
        const connectedEdges = edges.filter(
          (edge) => edge.source === nodeId || edge.target === nodeId
        )
        const connectedNodeIds = new Set<string>()

        connectedEdges.forEach((edge) => {
          connectedNodeIds.add(edge.source)
          connectedNodeIds.add(edge.target)
        })

        // 노드 하이라이트 업데이트
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isHighlighted: connectedNodeIds.has(node.id)
            }
          }))
        )

        // 엣지 하이라이트 업데이트
        setEdges((prevEdges) =>
          prevEdges.map((edge) => ({
            ...edge,
            data: {
              ...edge.data,
              isHighlighted: connectedEdges.some((connectedEdge) => connectedEdge.id === edge.id)
            }
          }))
        )
      } else {
        // 모든 하이라이트 제거
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isHighlighted: false
            }
          }))
        )

        setEdges((prevEdges) =>
          prevEdges.map((edge) => ({
            ...edge,
            data: {
              ...edge.data,
              isHighlighted: false
            }
          }))
        )
      }
    },
    [edges, setNodes, setEdges]
  )

  useEffect(() => {
    window.addEventListener('nodeHover', handleNodeHover)
    return () => {
      window.removeEventListener('nodeHover', handleNodeHover)
    }
  }, [handleNodeHover])

  return (
    <div className="w-full h-screen bg-zinc-900">
      <style>{`
        .react-flow__edge {
          z-index: 10 !important;
        }
        .react-flow__node {
          z-index: 5 !important;
        }
        /* 기본 edge path 숨기기 */
        .react-flow__edge-path[data-testid] {
          display: none;
        }
      `}</style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={{ background: '#18181b' }}
        defaultEdgeOptions={{
          style: { display: 'none' }
        }}
      >
        <Controls showInteractive={false} />
        <Background />
      </ReactFlow>
    </div>
  )
}
