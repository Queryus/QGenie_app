import type { FC } from 'react'
import styles from './makers.module.css'
import { CardinalityZeroOrOneLeftMarker } from './makers/zero-or-one-left'
import { CardinalityZeroOrManyLeftMarker } from './makers/zero-or-many-left'
import { CardinalityZeroOrOneRightMarker } from './makers/zero-or-one-right'
import { CardinalityZeroOrManyRightMarker } from './makers/zero-or-many-right'

export const CardinalityMarkers: FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Left markers */}
      <CardinalityZeroOrOneLeftMarker id="zeroOrOneLeft" color="var(--pane-border-hover)" />
      <CardinalityZeroOrOneLeftMarker
        id="zeroOrOneLeftHighlight"
        isHighlighted={true}
        color="var(--node-layout)"
      />
      <CardinalityZeroOrManyLeftMarker id="zeroOrManyLeft" color="var(--pane-border-hover)" />
      <CardinalityZeroOrManyLeftMarker
        id="zeroOrManyLeftHighlight"
        isHighlighted={true}
        color="var(--node-layout)"
      />

      {/* Right markers */}
      <CardinalityZeroOrOneRightMarker id="zeroOrOneRight" color="var(--pane-border-hover)" />
      <CardinalityZeroOrOneRightMarker
        id="zeroOrOneRightHighlight"
        isHighlighted={true}
        color="var(--node-layout)"
      />
      <CardinalityZeroOrManyRightMarker id="zeroOrManyRight" color="var(--pane-border-hover)" />
      <CardinalityZeroOrManyRightMarker
        id="zeroOrManyRightHighlight"
        isHighlighted={true}
        color="var(--node-layout)"
      />
    </div>
  )
}
