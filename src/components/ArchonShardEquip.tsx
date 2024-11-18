'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { useArchonShardStore } from '@/stores/archonShardStore'
import { useBonusDialogStore } from '@/stores/bonusDialogStore'
import { SHARD_COLORS, type ShardColor } from '@/types/ArchonShard'
import * as React from 'react'
import { ArchonShardHexagon } from './ArchonShardHexagon'
import { ArchonShardSelector } from './ArchonShardSelector'
import { ArchonShardSummary } from './ArchonShardSummary'

export function ArchonShardEquip() {
  const {
    equippedShards,
    selectingPosition,
    setSelectingPosition,
    selectShard,
    selectBonus
  } = useArchonShardStore()
  const { openDialog } = useBonusDialogStore()

  // Add ref and position tracking
  const hexagonRefs = React.useRef<(HTMLDivElement | null)[]>([
    null,
    null,
    null,
    null,
    null
  ])
  const [selectorCenter, setSelectorCenter] = React.useState({ x: 0, y: 0 })

  const getHexagonCenter = React.useCallback((position: number) => {
    const ref = hexagonRefs.current[position]
    if (!ref) return { x: 0, y: 0 }

    const rect = ref.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }, [])

  // Update center when selecting position changes
  React.useEffect(() => {
    if (selectingPosition !== null) {
      const center = getHexagonCenter(selectingPosition)
      setSelectorCenter(center)
    }
  }, [selectingPosition, getHexagonCenter])

  const handleSelectShard = (
    position: number,
    color?: ShardColor,
    tauforged?: boolean
  ) => {
    if (!color || typeof tauforged !== 'boolean') return
    selectShard(position, { color, tauforged })
    openDialog({
      position,
      color,
      tauforged,
      onSelect: (buff) => {
        selectBonus(buff)
      }
    })
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col w-full gap-8">
        <div className="hexagon-container">
          {/* First row */}
          <ArchonShardHexagon
            position={3}
            equipped={equippedShards[3]}
            onClick={() => setSelectingPosition(3)}
            tooltipSide="left"
            ref={(el) => (hexagonRefs.current[3] = el)}
          />
          <div /> {/* spacer */}
          <ArchonShardHexagon
            position={4}
            equipped={equippedShards[4]}
            onClick={() => setSelectingPosition(4)}
            tooltipSide="right"
            ref={(el) => (hexagonRefs.current[4] = el)}
          />
          {/* Second row */}
          <ArchonShardHexagon
            position={1}
            equipped={equippedShards[1]}
            onClick={() => setSelectingPosition(1)}
            tooltipSide="left"
            ref={(el) => (hexagonRefs.current[1] = el)}
          />
          <ArchonShardHexagon
            position={2}
            equipped={equippedShards[2]}
            onClick={() => setSelectingPosition(2)}
            tooltipSide="right"
            ref={(el) => (hexagonRefs.current[2] = el)}
          />
          <div /> {/* spacer 1 */}
          <div /> {/* spacer 2 */}
          {/* Bottom row */}
          <ArchonShardHexagon
            position={0}
            equipped={equippedShards[0]}
            onClick={() => setSelectingPosition(0)}
            tooltipSide="bottom"
            ref={(el) => (hexagonRefs.current[0] = el)}
          />
        </div>

        <ArchonShardSelector
          isOpen={selectingPosition !== null}
          onClose={() => setSelectingPosition(null)}
          onSelect={(color, tauforged) => {
            if (selectingPosition !== null) {
              handleSelectShard(selectingPosition, color, tauforged)
              setSelectingPosition(null)
            }
          }}
          center={selectorCenter}
          colors={SHARD_COLORS}
        />

        <ArchonShardSummary />
      </div>
    </TooltipProvider>
  )
}
