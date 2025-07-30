import { BaseEdge, type EdgeProps, getBezierPath, Position } from '@xyflow/react'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './relationship-edge.module.css'
import type { RelationshipEdgeType } from './type'

const PARTICLE_COUNT = 6
const ANIMATE_DURATION = 6

type Props = EdgeProps<RelationshipEdgeType>

/**
 * ERD 커스텀 Edge 랜더링 함수
 *
 * @author 6-keem
 *
 * @param sourceX...data 위치 및 Edge 정보
 * @returns
 */
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
  const isHighlighted = data?.isHighlighted ?? false // 하이라이트 여부
  const cardinality = data?.cardinality ?? 'ONE_TO_MANY' // 관계 표시
  const label = data?.label // 관계 라벨

  // 관계가 테이블 뒤에 가려지는 문제 해결
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

  // 곡선 Edge
  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition
  })

  // 하이라이트 여부에 따라 랜더링
  const getMarkerStart = (): string => {
    if (sourcePosition === Position.Right) {
      return isHighlighted ? 'url(#zeroOrOneRightHighlight)' : 'url(#zeroOrOneRight)'
    } else {
      return isHighlighted ? 'url(#zeroOrManyLeftHighlight)' : 'url(#zeroOrManyLeft)'
    }
  }

  // 하이라이트 여부에 따라 랜더링
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
      {/* 입자들 source -> target으로 이동하는 애니메이션 효과 */}
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

      {/* 관계 라벨 */}
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

      {/* 입자 애니메이션 그라데이션 */}
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
