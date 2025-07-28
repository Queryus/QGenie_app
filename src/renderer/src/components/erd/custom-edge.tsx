import type React from 'react'
import { type EdgeProps, getBezierPath } from '@xyflow/react'

export interface ErdEdgeProps extends EdgeProps {
  data?: {
    isHighlighted?: boolean
    relationshipType?: 'one-to-one' | 'one-to-many' | 'many-to-many'
    sourceCardinality?: 'one' | 'many'
    targetCardinality?: 'one' | 'many'
    label?: string
  }
}

// ERD 관계 기호를 그리는 함수들
const drawOneSymbol = (x: number, y: number, angle: number, color: string): React.JSX.Element => {
  const length = 12
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const x1 = x - (cos * length) / 2
  const y1 = y - (sin * length) / 2
  const x2 = x + (cos * length) / 2
  const y2 = y + (sin * length) / 2

  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeLinecap="round" />
  )
}

const drawManySymbol = (x: number, y: number, angle: number, color: string): React.JSX.Element => {
  const length = 12
  const width = 8
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const tipX = x + cos * length
  const tipY = y + sin * length

  const perpCos = Math.cos(angle + Math.PI / 2)
  const perpSin = Math.sin(angle + Math.PI / 2)

  const leftX = x + (perpCos * width) / 2
  const leftY = y + (perpSin * width) / 2
  const rightX = x - (perpCos * width) / 2
  const rightY = y - (perpSin * width) / 2

  return (
    <g>
      <line
        x1={tipX}
        y1={tipY}
        x2={leftX}
        y2={leftY}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <line
        x1={tipX}
        y1={tipY}
        x2={rightX}
        y2={rightY}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <line
        x1={tipX}
        y1={tipY}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

export function ErdEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data
}: ErdEdgeProps): React.JSX.Element {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  })

  const isHighlighted = data?.isHighlighted || false
  const sourceCardinality = data?.sourceCardinality || 'one'
  const targetCardinality = data?.targetCardinality || 'many'
  const label = data?.label

  const strokeColor = isHighlighted ? '#9F73FF' : '#454545'
  const symbolColor = isHighlighted ? '#9F73FF' : '#666666'

  const sourceAngle = Math.atan2(targetY - sourceY, targetX - sourceX)
  const targetAngle = Math.atan2(sourceY - targetY, sourceX - targetX)

  const labelX = (sourceX + targetX) / 2
  const labelY = (sourceY + targetY) / 2

  return (
    <g>
      {isHighlighted && (
        <>
          <path
            d={edgePath}
            fill="none"
            stroke="#9F73FF"
            strokeWidth={3}
            strokeDasharray="none"
            style={{
              filter: 'blur(8px)',
              opacity: 0.1
            }}
          />
          <path
            d={edgePath}
            fill="none"
            stroke="#9F73FF"
            strokeWidth={3}
            strokeDasharray="none"
            style={{
              filter: 'blur(8px)',
              opacity: 0.1
            }}
          />
        </>
      )}

      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHighlighted ? 2 : 1.5}
        strokeDasharray="none"
        className="transition-colors duration-300"
        style={{
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }}
      />

      {/* 소스 쪽 관계 기호 */}
      {sourceCardinality === 'one' && drawOneSymbol(sourceX, sourceY, sourceAngle, symbolColor)}
      {sourceCardinality === 'many' && drawManySymbol(sourceX, sourceY, sourceAngle, symbolColor)}

      {/* 타겟 쪽 관계 기호 */}
      {targetCardinality === 'one' && drawOneSymbol(targetX, targetY, targetAngle, symbolColor)}
      {targetCardinality === 'many' && drawManySymbol(targetX, targetY, targetAngle, symbolColor)}

      {/* 관계 라벨 */}
      {label && (
        <text
          x={labelX}
          y={labelY - 8}
          fill={isHighlighted ? '#9F73FF' : '#888888'}
          fontSize="12"
          textAnchor="middle"
          className="transition-colors duration-300 select-none"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '500'
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}
