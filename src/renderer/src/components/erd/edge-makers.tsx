import type { FC } from 'react'

export const EdgeMarkers: FC = () => {
  return (
    <defs>
      <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9F73FF" stopOpacity="0" />
        <stop offset="50%" stopColor="#9F73FF" stopOpacity="1" />
        <stop offset="100%" stopColor="#9F73FF" stopOpacity="0" />
      </linearGradient>

      <marker
        id="zeroOrOneRight"
        markerWidth="30"
        markerHeight="30"
        refX="26"
        refY="15"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx="15" cy="15" r="5" fill="none" stroke="#454545" strokeWidth="2" />
        <line x1="22" y1="8" x2="22" y2="22" stroke="#454545" strokeWidth="2.5" />
      </marker>

      <marker
        id="zeroOrOneRightHighlight"
        markerWidth="30"
        markerHeight="30"
        refX="26"
        refY="15"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx="15" cy="15" r="5" fill="none" stroke="#9F73FF" strokeWidth="2.5" />
        <line x1="22" y1="8" x2="22" y2="22" stroke="#9F73FF" strokeWidth="2.5" />
      </marker>

      <marker
        id="zeroOrOneLeft"
        markerWidth="30"
        markerHeight="30"
        refX="4"
        refY="15"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line x1="8" y1="8" x2="8" y2="22" stroke="#454545" strokeWidth="2.5" />
        <circle cx="15" cy="15" r="5" fill="none" stroke="#454545" strokeWidth="2" />
      </marker>

      <marker
        id="zeroOrOneLeftHighlight"
        markerWidth="30"
        markerHeight="30"
        refX="4"
        refY="15"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line x1="8" y1="8" x2="8" y2="22" stroke="#9F73FF" strokeWidth="2.5" />
        <circle cx="15" cy="15" r="5" fill="none" stroke="#9F73FF" strokeWidth="2.5" />
      </marker>

      <marker
        id="zeroOrManyLeft"
        markerWidth="30"
        markerHeight="30"
        refX="4"
        refY="15"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx="15" cy="15" r="5" fill="none" stroke="#454545" strokeWidth="2" />
        <path d="M 8 8 L 22 15 L 8 22" fill="none" stroke="#454545" strokeWidth="2.5" />
      </marker>

      <marker
        id="zeroOrManyLeftHighlight"
        markerWidth="30"
        markerHeight="30"
        refX="4"
        refY="15"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx="15" cy="15" r="5" fill="none" stroke="#9F73FF" strokeWidth="2.5" />
        <path d="M 8 8 L 22 15 L 8 22" fill="none" stroke="#9F73FF" strokeWidth="2.5" />
      </marker>
    </defs>
  )
}
