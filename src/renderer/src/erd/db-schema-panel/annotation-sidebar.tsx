import { useState, useRef } from 'react'
import AnnotationItem from './annotation-item'
import { AnnotationNode } from './annotation.types'

interface AnnotationSidebarProps {
  dbList: AnnotationNode[]
  selectedDB: AnnotationNode | null
  setSelectedDB: (selectedNode: AnnotationNode) => void
}

export default function AnnotationSidebar({
  dbList,
  selectedDB,
  setSelectedDB
}: AnnotationSidebarProps): React.JSX.Element {
  const [width, setWidth] = useState(220)
  const isResizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleMouseDown = (e: React.MouseEvent): void => {
    isResizing.current = true
    startX.current = e.clientX
    startWidth.current = width

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent): void => {
    if (!isResizing.current) return
    const deltaX = e.clientX - startX.current
    const newWidth = startWidth.current + deltaX
    if (newWidth > 120 && newWidth < 500) {
      setWidth(newWidth)
    }
  }

  const handleMouseUp = (): void => {
    isResizing.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleToggle = (nodeId: number): void => {
    setSelectedDB(dbList[nodeId])
  }

  return (
    <div className="flex h-full">
      <div
        style={{ width, minWidth: 200, maxWidth: 500 }}
        className="h-full p-3 bg-neutral-800 outline-1 flex-col justify-start items-start inline-flex select-none"
      >
        {dbList.map((db, index) => {
          return (
            <AnnotationItem
              db={db}
              hasFocus={selectedDB === db}
              index={index}
              onToggle={handleToggle}
              key={db.id}
            />
          )
        })}
      </div>

      <div onMouseDown={handleMouseDown} className="w-1 cursor-col-resize bg-genie-800" />
    </div>
  )
}
