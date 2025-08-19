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
  ReactFlowProvider,
  Node,
  OnNodesChange
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useCallback, useState, Dispatch, SetStateAction } from 'react'
import { RelationshipEdge } from '@/components/erd/relationship-edge'
import { CardinalityMarkers } from '@/components/erd/cardinarity-makers'
import { initialEdges } from './erd.type'
import { Sidebar } from '@/components/layout/side-bar'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'
import AnnotationSidebar from './db-schema-panel/annotation-sidebar'
import { AnnotationNode } from './db-schema-panel/annotation.types'
import { Button } from '@/components/ui/button'
import { BadgePlus } from 'lucide-react'

const nodeTypes = {
  table: TableNode
}

const edgeTypes = {
  relationship: RelationshipEdge
}

interface ErdContentProps {
  nodes: Node[]
  setNodes: Dispatch<SetStateAction<Node[]>>
  onNodesChange: OnNodesChange<Node>
}

/**
 * ERD 페이지 컨텐트
 *
 * @author 6-keem
 *
 * @returns JSX.Element
 */
function ErdContent({ nodes, setNodes, onNodesChange }: ErdContentProps): React.JSX.Element {
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
  const [dbList, setDBList] = useState<AnnotationNode[]>([])
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [selectedDB, setSelectedDB] = useState<AnnotationNode | null>(null)

  useEffect(() => {
    api
      .get(`/api/user/db/find/all`)
      .then((response) => {
        const connections = response.data

        const list: AnnotationNode[] = []
        connections.map((connection) => {
          list.push({
            id: connection.id,
            name: connection.name,
            type: connection.type,
            host: connection.host,
            port: connection.port,
            view_name: connection.view_name
          })
        })

        setDBList(list)

        if (list.length !== 0) setSelectedDB(list[0])
      })
      .catch(() => {
        toast.error('어노테이션 조회 중 오류가 발생했습니다.')
      })
  }, [])

  useEffect(() => {
    if (!selectedDB) return
    api
      .get(`/api/annotations/find/db/${selectedDB?.id}`)
      .then((response) => {
        // FIXME: 테스트
        const annotation = response.data

        // const annotation = TEST_ANNOTATION

        const nodes: Node[] = annotation.tables.map((table, idx: number) => {
          // 제약조건/인덱스 정리용 맵
          const constraintMap: Record<string, string[]> = {}

          // constraints -> columnName 기준으로 constraints 배열에 push
          table.constraints?.forEach((c) => {
            c.columns.forEach((col: string) => {
              if (!constraintMap[col]) constraintMap[col] = []
              if (c.type === 'PRIMARY KEY') constraintMap[col].push('primary')
              if (c.type === 'UNIQUE') constraintMap[col].push('unique')
            })
          })

          // columns -> Node의 data.columns 로 변환
          const nodeColumns = table.columns.map((col) => {
            const colConstraints = constraintMap[col.column_name] || []
            if (!col.is_nullable) colConstraints.push('not-null')
            else colConstraints.push('nullable')

            return {
              name: col.column_name,
              type: col.data_type,
              constraints: colConstraints,
              description: col.description || undefined
            }
          })

          return {
            id: table.id,
            type: 'table',
            position: { x: 400, y: idx * 200 }, // 테이블별 y 위치 다르게
            data: {
              tableName: table.table_name,
              columns: nodeColumns
            }
          }
        })

        setNodes(nodes)
      })
      .catch(() => {
        toast.error('어노테이션 조회 중 오류가 발생했습니다.')
      })
  }, [selectedDB, setNodes])

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen bg-zinc-900 flex overflow-hidden relative">
        <Sidebar />
        <AnnotationSidebar dbList={dbList} selectedDB={selectedDB} setSelectedDB={setSelectedDB} />
        <div className="flex-1 relative">
          <ErdContent nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} />

          <Button
            className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-4 text-white rounded-lg shadow-lg"
            onClick={() => {
              api
                .post('/api/annotations/create', {
                  db_profile_id: selectedDB?.id
                })
                .then(() => {
                  toast.success('어노테이션 생성이 완료되었습니다. 🎉')
                })
                .catch(() => {
                  toast.error('어노테이션 생성 중 오류가 발생했습니다.')
                })
            }}
          >
            <BadgePlus />
            어노테이션 생성
          </Button>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
