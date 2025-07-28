import { BaseEdge, type EdgeProps, getBezierPath, Position } from '@xyflow/react'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './relationship-edge.module.css'
import type { RelationshipEdgeType } from './type'

const PARTICLE_COUNT = 6
const ANIMATE_DURATION = 6

type Props = EdgeProps<RelationshipEdgeType>

export const RelationshipEdge: FC<Props> = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  id,
  data
}) => {
  const isHighlighted = data?.isHighlighted ?? false
  const cardinality = data?.cardinality ?? 'ONE_TO_MANY'
  const label = data?.label

  const getOffset = (position: Position): { x: number; y: number } => {
    switch (position) {
      case Position.Left:
        return { x: -28, y: 0 }
      case Position.Right:
        return { x: 26, y: 0 }
      default:
        return { x: 0, y: 0 }
    }
  }

  const sourceOffset = getOffset(sourcePosition)
  const targetOffset = getOffset(targetPosition)

  const adjustedSourceX = sourceX + sourceOffset.x
  const adjustedSourceY = sourceY + sourceOffset.y
  const adjustedTargetX = targetX + targetOffset.x
  const adjustedTargetY = targetY + targetOffset.y

  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition
  })

  const getMarkerStart = (): string => {
    if (sourcePosition === Position.Right) {
      return isHighlighted ? 'url(#zeroOrOneRightHighlight)' : 'url(#zeroOrOneRight)'
    } else {
      return isHighlighted ? 'url(#zeroOrManyLeftHighlight)' : 'url(#zeroOrManyLeft)'
    }
  }

  const getMarkerEnd = (): string => {
    if (targetPosition === Position.Left) {
      if (cardinality === 'ONE_TO_ONE') {
        return isHighlighted ? 'url(#zeroOrOneLeftHighlight)' : 'url(#zeroOrOneLeft)'
      } else {
        return isHighlighted ? 'url(#zeroOrManyLeftHighlight)' : 'url(#zeroOrManyLeft)'
      }
    } else {
      if (cardinality === 'ONE_TO_ONE') {
        return isHighlighted ? 'url(#zeroOrOneRightHighlight)' : 'url(#zeroOrOneRight)'
      } else {
        return isHighlighted ? 'url(#zeroOrManyRightHighlight)' : 'url(#zeroOrManyRight)'
      }
    }
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={getMarkerStart()}
        markerEnd={getMarkerEnd()}
        className={clsx(styles.edge, isHighlighted && styles.hovered)}
      />
      {isHighlighted &&
        [...Array(PARTICLE_COUNT)].map((_, i) => (
          <ellipse
            key={`particle-${i}-${ANIMATE_DURATION}`}
            rx="5"
            ry="1.2"
            fill="url(#particleGradient)"
          >
            <animateMotion
              begin={`${-i * (ANIMATE_DURATION / PARTICLE_COUNT)}s`}
              dur={`${ANIMATE_DURATION}s`}
              repeatCount="indefinite"
              rotate="auto"
              path={edgePath}
              calcMode="spline"
              keySplines="0.42, 0, 0.58, 1.0"
            />
          </ellipse>
        ))}

      {label && (
        <text
          x={(adjustedSourceX + adjustedTargetX) / 2}
          y={(adjustedSourceY + adjustedTargetY) / 2 - 8}
          fill={isHighlighted ? '#9F73FF' : '#888888'}
          fontSize="12"
          textAnchor="middle"
          className="transition-colors duration-300 select-none"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '500',
            zIndex: 1000
          }}
        >
          {label}
        </text>
      )}

      <defs>
        <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9F73FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#9F73FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#9F73FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </>
  )
}
