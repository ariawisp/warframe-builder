'use client'

import { ArchonShard } from '@/components/ArchonShard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type ShardColor, getShardTextColor } from '@/types/ArchonShard'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { createPortal } from 'react-dom'

const SELECTOR_SIZE = 64
const ANIMATION_DURATION = 0.15

interface ArchonShardSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (color: ShardColor, tauforged: boolean) => void
  center: { x: number; y: number }
  colors: ShardColor[]
}

export function ArchonShardSelector({
  isOpen,
  onClose,
  onSelect,
  center,
  colors
}: ArchonShardSelectorProps) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <TooltipProvider>
          <motion.div
            className="fixed inset-0 bg-background/75 backdrop-blur-sm z-[40]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            onClick={onClose}
          />

          {colors.map((color, index) => {
            const angle = (index / colors.length) * 360
            const radius = 120
            const buttonOffset = SELECTOR_SIZE / 2
            const x =
              Math.cos(((angle - 90) * Math.PI) / 180) * radius - buttonOffset
            const y =
              Math.sin(((angle - 90) * Math.PI) / 180) * radius - buttonOffset
            const textColor = getShardTextColor(color)
            const tooltipSide = angle >= 90 && angle < 270 ? 'bottom' : 'top'

            // Calculate outer ring positions
            const outerRadius = radius * 1.75
            const outerX =
              Math.cos(((angle - 90) * Math.PI) / 180) * outerRadius -
              buttonOffset
            const outerY =
              Math.sin(((angle - 90) * Math.PI) / 180) * outerRadius -
              buttonOffset

            return (
              <React.Fragment key={color}>
                {/* Regular shard button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className="fixed z-[41]"
                      style={{
                        left: center.x,
                        top: center.y
                      }}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        x: x * 0.2,
                        y: y * 0.2
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: x,
                        y: y
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: ANIMATION_DURATION }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        onSelect(color, false)
                      }}
                    >
                      <ArchonShard
                        color={color}
                        tauforged={false}
                        size={SELECTOR_SIZE}
                      />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent className={textColor}>
                    <span className="capitalize">{color}</span> Archon Shard
                  </TooltipContent>
                </Tooltip>

                {/* Tauforged shard button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className="fixed z-[41]"
                      style={{
                        left: center.x,
                        top: center.y
                      }}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        x: x * 0.4,
                        y: y * 0.4
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: outerX,
                        y: outerY
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: ANIMATION_DURATION }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        onSelect(color, true)
                      }}
                    >
                      <ArchonShard
                        color={color}
                        tauforged={true}
                        size={SELECTOR_SIZE}
                      />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent className={cn(textColor, 'font-bold')}>
                    <span className="capitalize">{color}</span> Archon Shard
                    (Tauforged)
                  </TooltipContent>
                </Tooltip>
              </React.Fragment>
            )
          })}
        </TooltipProvider>
      )}
    </AnimatePresence>,
    document.body
  )
}
