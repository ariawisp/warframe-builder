'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  useArchonShardStore,
  type EquippedShard
} from '@/stores/archonShardStore'
import { useBonusDialogStore } from '@/stores/bonusDialogStore'
import { SHARD_COLORS, type ShardColor } from '@/types/ArchonShard'
import { getArchonShard } from '@/util/getArchonShard'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { ArchonShard } from './ArchonShard'
import { ArchonShardSummary } from './ArchonShardSummary'

const HEXAGON_SIZE = 128
const HEXAGON_ASPECT = 1.155
const SELECTOR_SIZE = 64
const ANIMATION_DURATION = 0.15

interface HexagonSlotProps {
  position: number
  equipped?: EquippedShard
  onSelect: (shard?: EquippedShard) => void
  isSelecting: boolean
  onSelectingChange: (isSelecting: boolean) => void
  className?: string
  style?: React.CSSProperties
}

const getShardTextColor = (color: ShardColor): string => {
  switch (color) {
    case 'azure':
      return 'text-sky-500'
    case 'crimson':
      return 'text-red-500'
    case 'amber':
      return 'text-amber-500'
    case 'emerald':
      return 'text-emerald-500'
    case 'violet':
      return 'text-fuchsia-500'
    case 'topaz':
      return 'text-yellow-500'
    default:
      return 'text-muted-foreground'
  }
}

function formatBuffValueCompact(buff: ShardBuff, tauforged: boolean): string {
  const value = tauforged ? buff.value.tauforged : buff.value.base

  if (buff.value.isPercentage) {
    return `+${value}%`
  }

  // Special cases for different buff types
  switch (buff.name) {
    case 'Health Regeneration':
      return `${value}/s`
    case 'Blast Kill Health':
    case 'Blast Kill Shield Regen':
    case 'Heat Kill Critical Chance':
      return `+${value}/kill`
    case 'Toxin Health Recovery':
      return `+${value}/tick`
    case 'Initial Energy':
      return `${value}%`
    default:
      return `+${value}`
  }
}

function HexagonSlot({
  position,
  equipped,
  onSelect,
  isSelecting,
  onSelectingChange,
  className,
  style
}: HexagonSlotProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const textColor =
    equipped ? getShardTextColor(equipped.color) : 'text-muted-foreground'

  const getHexagonCenter = React.useCallback(() => {
    if (!ref.current) return { x: 0, y: 0 }
    const rect = ref.current.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }, [position])

  const hexagonCenter = React.useMemo(
    () => getHexagonCenter(),
    [getHexagonCenter, isSelecting]
  )

  React.useEffect(() => {
    const updateCenter = () => {
      const newCenter = getHexagonCenter()
      if (newCenter.x !== hexagonCenter.x || newCenter.y !== hexagonCenter.y) {
        // Force a re-render to update the center
        onSelectingChange(false)
        onSelectingChange(true)
      }
    }

    window.addEventListener('resize', updateCenter)
    window.addEventListener('scroll', updateCenter)

    return () => {
      window.removeEventListener('resize', updateCenter)
      window.removeEventListener('scroll', updateCenter)
    }
  }, [hexagonCenter, getHexagonCenter, onSelectingChange])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onSelectingChange(true)
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (equipped) {
      onSelect(undefined)
    }
  }

  return (
    <div
      className={cn('relative', className)}
      style={style}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <Tooltip>
        <div className="flex flex-col items-center gap-1">
          <TooltipTrigger asChild>
            <div
              ref={ref}
              className={`relative cursor-pointer bg-opacity-35 hover:bg-opacity-50 transition-all hexagon bg-slate-700 flex items-center justify-center ${
                equipped ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
              style={{
                width: `${HEXAGON_SIZE}px`,
                aspectRatio: HEXAGON_ASPECT
              }}
            >
              {equipped ?
                <ArchonShard
                  color={equipped.color}
                  tauforged={equipped.tauforged}
                />
              : <span className="text-gray-500">Empty</span>}
            </div>
          </TooltipTrigger>
          {equipped?.buff && (
            <div className="text-center">
              <div
                className={`text-xs ${textColor} ${equipped.tauforged ? 'font-semibold' : 'font-normal'}`}
              >
                {equipped.buff.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatBuffValueCompact(equipped.buff, equipped.tauforged)}
              </div>
            </div>
          )}
          {equipped && (
            <TooltipContent
              className={`${textColor} ${equipped.tauforged ? 'font-bold' : ''}`}
            >
              <div className="flex flex-col gap-1">
                <div>
                  <span className="capitalize">{equipped.color}</span> Archon
                  Shard
                  {equipped.tauforged && ' (Tauforged)'}
                </div>
                {equipped.buff && (
                  <>
                    <div className="font-semibold mt-1">
                      {equipped.buff.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Value:{' '}
                      {formatBuffValueCompact(
                        equipped.buff,
                        equipped.tauforged
                      )}
                    </div>
                  </>
                )}
              </div>
            </TooltipContent>
          )}
        </div>
      </Tooltip>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isSelecting && (
              <>
                <motion.div
                  className="fixed inset-0 bg-background/75 backdrop-blur-sm z-[40]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: ANIMATION_DURATION }}
                  onClick={() => onSelectingChange(false)}
                />

                {SHARD_COLORS.map((color, index) => {
                  const angle = (index / SHARD_COLORS.length) * 360
                  const radius = 120
                  const x = Math.cos(((angle - 90) * Math.PI) / 180) * radius
                  const y = Math.sin(((angle - 90) * Math.PI) / 180) * radius
                  const shard = getArchonShard(color, false)
                  const tauforgedShard = getArchonShard(color, true)
                  const textColor = getShardTextColor(color)
                  const left = hexagonCenter.x - SELECTOR_SIZE / 2
                  const top =
                    hexagonCenter.y - SELECTOR_SIZE / HEXAGON_ASPECT / 2

                  return (
                    <React.Fragment key={color}>
                      {/* Regular shard button - closer to center */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            className="relative z-[41]"
                            style={{
                              position: 'fixed',
                              left,
                              top,
                              width: SELECTOR_SIZE,
                              height: SELECTOR_SIZE,
                              transform: `rotate(${angle}deg)`
                            }}
                            initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              x: x * 0.9,
                              y: y * 0.9
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: ANIMATION_DURATION }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              onSelect({ color, tauforged: false })
                            }}
                          >
                            <ArchonShard
                              color={color}
                              tauforged={false}
                              size={SELECTOR_SIZE}
                            />
                          </motion.button>
                        </TooltipTrigger>
                        {shard && (
                          <TooltipContent className={textColor}>
                            {shard.name.replace(/^<.*?> /, '')}
                          </TooltipContent>
                        )}
                      </Tooltip>

                      {/* Tauforged shard button - further from center */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            className="relative z-[41]"
                            style={{
                              position: 'fixed',
                              left,
                              top,
                              width: SELECTOR_SIZE,
                              height: SELECTOR_SIZE,
                              transform: `rotate(${angle}deg)`
                            }}
                            initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              x: x * 1.75,
                              y: y * 1.75
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: ANIMATION_DURATION }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              onSelect({ color, tauforged: true })
                            }}
                          >
                            <ArchonShard
                              color={color}
                              tauforged={true}
                              size={SELECTOR_SIZE}
                            />
                          </motion.button>
                        </TooltipTrigger>
                        {tauforgedShard && (
                          <TooltipContent className={`${textColor} font-bold`}>
                            {`${tauforgedShard.name
                              .replace(/^<.*?> /, '')
                              .replace(/^Tauforged /, '')} (Tauforged)`}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export function ArchonShardEquip() {
  const {
    equippedShards,
    selectingPosition,
    pendingShard,
    setSelectingPosition,
    selectShard,
    selectBonus,
    cancelSelection
  } = useArchonShardStore()
  const { openDialog } = useBonusDialogStore()

  const handleSelectShard = (
    position: number,
    color: ShardColor,
    tauforged: boolean
  ) => {
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
    <TooltipProvider>
      <div className="flex flex-col items-center">
        <div
          className="relative"
          style={
            {
              '--v-width': '600px',
              '--v-height': '400px',
              '--v-middle-offset': '120px',
              '--hexagon-width': `${HEXAGON_SIZE}px`,
              '--hexagon-aspect': HEXAGON_ASPECT,
              width: 'var(--v-width)',
              height: 'var(--v-height)'
            } as React.CSSProperties
          }
        >
          {/* Top row */}
          <div className="absolute left-0 top-0">
            <HexagonSlot
              position={3}
              equipped={equippedShards[3]}
              onSelect={(shard) =>
                handleSelectShard(3, shard?.color, shard?.tauforged)
              }
              isSelecting={selectingPosition === 3}
              onSelectingChange={(isSelecting) =>
                setSelectingPosition(isSelecting ? 3 : null)
              }
            />
          </div>
          <div className="absolute right-0 top-0">
            <HexagonSlot
              position={4}
              equipped={equippedShards[4]}
              onSelect={(shard) =>
                handleSelectShard(4, shard?.color, shard?.tauforged)
              }
              isSelecting={selectingPosition === 4}
              onSelectingChange={(isSelecting) =>
                setSelectingPosition(isSelecting ? 4 : null)
              }
            />
          </div>

          {/* Middle row */}
          <div
            className="absolute left-0 top-0"
            style={{
              left: 'var(--v-middle-offset)',
              top: 'var(--v-middle-offset)'
            }}
          >
            <HexagonSlot
              position={1}
              equipped={equippedShards[1]}
              onSelect={(shard) =>
                handleSelectShard(1, shard?.color, shard?.tauforged)
              }
              isSelecting={selectingPosition === 1}
              onSelectingChange={(isSelecting) =>
                setSelectingPosition(isSelecting ? 1 : null)
              }
            />
          </div>
          <div
            className="absolute right-0 top-0"
            style={{
              right: 'var(--v-middle-offset)',
              top: 'var(--v-middle-offset)'
            }}
          >
            <HexagonSlot
              position={2}
              equipped={equippedShards[2]}
              onSelect={(shard) =>
                handleSelectShard(2, shard?.color, shard?.tauforged)
              }
              isSelecting={selectingPosition === 2}
              onSelectingChange={(isSelecting) =>
                setSelectingPosition(isSelecting ? 2 : null)
              }
            />
          </div>

          {/* Bottom row */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: 'calc(var(--v-middle-offset) * 2)' }}
          >
            <HexagonSlot
              position={0}
              equipped={equippedShards[0]}
              onSelect={(shard) =>
                handleSelectShard(0, shard?.color, shard?.tauforged)
              }
              isSelecting={selectingPosition === 0}
              onSelectingChange={(isSelecting) =>
                setSelectingPosition(isSelecting ? 0 : null)
              }
            />
          </div>
        </div>
        <ArchonShardSummary />
      </div>
    </TooltipProvider>
  )
}
