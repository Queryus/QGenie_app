import type React from 'react'
import { type EdgeProps, getBezierPath } from '@xyflow/react'

export interface ErdEdgeProps extends EdgeProps {
  data?: {
    isHighlighted?: boolean
  }
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
        stroke={isHighlighted ? '#9F73FF' : '#454545'}
        strokeWidth={isHighlighted ? 2 : 1.5}
        strokeDasharray="none"
        className="transition-colors duration-300"
        style={{
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }}
      />
    </g>
  )
}
