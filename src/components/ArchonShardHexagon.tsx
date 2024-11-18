import { ArchonShard } from '@/components/ArchonShard'
import { BUFF_ICONS } from '@/components/ArchonShardBonusDialog'
import { Hexagon } from '@/components/Hexagon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type EquippedShard } from '@/stores/archonShardStore'
import { formatBuffValueCompact, getShardTextColor } from '@/types/ArchonShard'
import * as React from 'react'

interface ArchonShardHexagonProps {
  position: number
  equipped?: EquippedShard
  onClick: () => void
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  ref?: React.Ref<HTMLDivElement>
}

export function ArchonShardHexagon({
  position,
  equipped,
  onClick,
  tooltipSide = 'top',
  ref
}: ArchonShardHexagonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Hexagon ref={ref} onClick={onClick} color={equipped?.color}>
          {equipped ?
            <ArchonShard
              color={equipped.color}
              tauforged={equipped.tauforged}
            />
          : <span className="text-gray-500">Empty</span>}
        </Hexagon>
      </TooltipTrigger>
      {equipped && (
        <TooltipContent
          side={tooltipSide}
          sideOffset={tooltipSide === 'bottom' ? 32 : 4}
          className={cn(
            getShardTextColor(equipped.color),
            equipped.tauforged && 'font-bold'
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="capitalize">{equipped.color}</span> Archon Shard
              {equipped.tauforged && ' (Tauforged)'}
            </div>
            {equipped.buff && (
              <>
                <div className="font-semibold mt-1 flex items-center gap-1.5">
                  {React.createElement(BUFF_ICONS[equipped.buff.name], {
                    className: 'w-4 h-4'
                  })}
                  {equipped.buff.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Value:{' '}
                  {formatBuffValueCompact(equipped.buff, equipped.tauforged)}
                </div>
              </>
            )}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
