import type React from 'react'
import TableNode from '@/components/erd/table-node'
import { TableDetailSidebar } from '@/components/erd/table-detail-sidebar'
import type { TableNodeData } from '@/components/erd/table-node'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useCallback, useState } from 'react'
import { RelationshipEdge } from '@/components/erd/relationship-edge'
import { CardinalityMarkers } from '@/components/erd/cardinarity-makers'
import { initialEdges, initialNodes } from './erd.type'
import { Sidebar } from '@/components/layout/side-bar'

const nodeTypes = {
  table: TableNode
}

const edgeTypes = {
  relationship: RelationshipEdge
}

/**
 * ERD 페이지 컨텐트
 *
 * @author 6-keem
 *
 * @returns JSX.Element
 */
function ErdContent(): React.JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedTable, setSelectedTable] = useState<TableNodeData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { fitBounds, getNode } = useReactFlow()

  // 호버링 => 관계 되는 nodes, edges 하이라이팅
  const handleNodeHover = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<{ nodeId: string; isHovering: boolean }>
      const { nodeId, isHovering } = customEvent.detail

      if (isHovering) {
        const connectedEdges = edges.filter(
          (edge) => edge.source === nodeId || edge.target === nodeId
        )
        const connectedNodeIds = new Set<string>()
        connectedEdges.forEach((edge) => {
          connectedNodeIds.add(edge.source)
          connectedNodeIds.add(edge.target)
        })

        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isHighlighted: connectedNodeIds.has(node.id)
            }
          }))
        )

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

  // 노드 클릭 => 해당 노드로 화면 이동 & 어노테이션 탭 열기
  const handleNodeClick = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<{ nodeId: string; nodeData: TableNodeData }>
      const { nodeId, nodeData } = customEvent.detail

      const clickedNode = getNode(nodeId)
      if (clickedNode) {
        const nodeWidth = clickedNode.width ?? 200
        const nodeHeight = clickedNode.height ?? 100
        const offsetX = -300
        const offsetY = -100

        const bounds = {
          x: clickedNode.position.x - offsetX,
          y: clickedNode.position.y - offsetY,
          width: nodeWidth,
          height: nodeHeight
        }

        fitBounds(bounds, { duration: 800, padding: 9 })
      }

      setSelectedTable(nodeData)
      setSidebarOpen(true)
    },
    [fitBounds, getNode]
  )

  // 클릭 => 해당 노드 최상단으로 배치
  const handleNodeMouseDown = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<{ nodeId: string; nodeData: TableNodeData }>
      const { nodeId, nodeData } = customEvent.detail

      const clickedNode = getNode(nodeId)
      if (clickedNode) {
        // 배열 후미로 이동시키면 zIndex 올린 것과 동일 효과
        const filteredNodes = nodes.filter((node) => node.id !== clickedNode.id)
        filteredNodes.push(clickedNode)
        setNodes(filteredNodes)
      }

      setSelectedTable(nodeData)
    },
    [getNode, setNodes, nodes]
  )

  // 사이드바 (어노테이션 탭) 닫을때 애니메이션
  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false)
    setTimeout(() => {
      setSelectedTable(null)
    }, 300)
  }, [])

  // 이벤트 등록
  useEffect(() => {
    window.addEventListener('nodeHover', handleNodeHover)
    window.addEventListener('nodeClick', handleNodeClick)
    window.addEventListener('nodeDown', handleNodeMouseDown)

    return () => {
      window.removeEventListener('nodeHover', handleNodeHover)
      window.removeEventListener('nodeClick', handleNodeClick)
      window.removeEventListener('nodeDown', handleNodeMouseDown)
    }
  }, [handleNodeHover, handleNodeClick, handleNodeMouseDown])

  return (
    <div className="w-full h-screen bg-zinc-900 relative">
      <style>{`
        .react-flow__edge {
          z-index: 1 !important;
        }
        .react-flow__node {
          z-index: 10 !important;
        }
      `}</style>
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'mr-96' : 'mr-0'}`}
        style={{ width: '100%', height: '100vh' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          style={{ background: '#18181b' }}
        >
          <CardinalityMarkers />
          <Background />
        </ReactFlow>

        <TableDetailSidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          tableData={selectedTable}
        />
      </div>
    </div>
  )
}

/**
 * 최상위 ERD 페이지 컴포넌트
 * ReactFlowProvider로 전체 상태 공유
 */
export default function ErdPage(): React.JSX.Element {
  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen bg-zinc-900 flex overflow-hidden">
        <Sidebar />
        <ErdContent />
      </div>
    </ReactFlowProvider>
  )
}
