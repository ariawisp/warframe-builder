'use client'

import { ArchonShard } from '@/components/ArchonShard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBonusDialogStore } from '@/stores/bonusDialogStore'
import { SHARD_BUFFS, type ShardBuff } from '@/types/ArchonShard'
import {
  Activity,
  Battery,
  Bomb,
  Brain,
  ChevronsUp,
  Clock,
  Flame,
  Heart,
  Infinity,
  Radiation,
  Shield,
  Swords,
  Target,
  Waves,
  Weight,
  Zap,
  type LucideIcon
} from 'lucide-react'

const LARGE_SHARD_SIZE = 128

export const BUFF_ICONS: Record<string, LucideIcon> = {
  // Crimson shard buffs
  'Melee Critical Damage': Swords,
  'Primary Status Chance': Target,
  'Secondary Critical Chance': Target,
  'Ability Strength': Activity,
  'Ability Duration': Clock,

  // Amber shard buffs
  'Initial Energy': Battery,
  'Health Orb Effectiveness': Heart,
  'Energy Orb Effectiveness': Battery,
  'Casting Speed': Brain,
  'Parkour Velocity': Infinity,

  // Azure shard buffs
  Health: Heart,
  'Shield Capacity': Shield,
  'Energy Max': Battery,
  Armor: Weight,
  'Health Regeneration': Activity,

  // Emerald shard buffs
  'Toxin Status Damage': Waves,
  'Toxin Health Recovery': Heart,
  'Corrosive Ability Damage': Waves,
  'Corrosive Stack Increase': Infinity,

  // Topaz shard buffs
  'Blast Kill Health': Bomb,
  'Blast Kill Shield Regen': Shield,
  'Heat Kill Critical Chance': Flame,
  'Radiation Ability Damage': Radiation,

  // Violet shard buffs
  'Electric Status Ability Damage': Waves,
  'Electric Damage Bonus': Zap,
  'Energy Melee Crit': Swords,
  'Orb Conversion': Battery
}

function formatBuffValue(buff: ShardBuff, tauforged: boolean): string {
  const value = tauforged ? buff.value.tauforged : buff.value.base
  const maxValue = buff.value.maxValue?.[tauforged ? 'tauforged' : 'base']

  let displayValue = ''

  // Handle different types of values
  if (buff.value.isPercentage) {
    displayValue = `+${value}%`
  } else {
    // Special cases for different buff types
    switch (buff.name) {
      case 'Health Regeneration':
        displayValue = `${value} HP/s`
        break
      case 'Blast Kill Health':
        displayValue = `+${value} Health per kill`
        break
      case 'Blast Kill Shield Regen':
        displayValue = `+${value} Shields per kill`
        break
      case 'Heat Kill Critical Chance':
        displayValue = `+${value}% per kill`
        break
      case 'Toxin Health Recovery':
        displayValue = `+${value} Health per tick`
        break
      case 'Initial Energy':
        displayValue = `${value}% of max`
        break
      default:
        displayValue = `+${value}`
    }
  }

  // Add max value if present
  if (maxValue) {
    displayValue += ` (up to ${maxValue}${buff.value.isPercentage ? '%' : ''})`
  }

  return displayValue
}

export function ArchonShardBonusDialog() {
  const { isOpen, color, tauforged, onSelect, closeDialog } =
    useBonusDialogStore()

  if (!color) return null

  const buffs = SHARD_BUFFS[color]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-md fixed z-[200]">
        <div className="relative flex flex-col items-center">
          <ArchonShard
            color={color}
            tauforged={tauforged}
            size={LARGE_SHARD_SIZE}
          />
          <div className="text-center mt-2">
            <div className="font-semibold capitalize">
              {color} Archon Shard
              {tauforged && (
                <span className="text-amber-500 ml-1">(Tauforged)</span>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2 p-2">
            {buffs.map((buff) => {
              const Icon = BUFF_ICONS[buff.name] || Activity
              return (
                <Button
                  key={buff.name}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => {
                    onSelect?.(buff)
                    closeDialog()
                  }}
                >
                  <div className="flex flex-col items-start gap-1 text-left w-full break-words">
                    <div className="flex items-center gap-2 font-bold">
                      <Icon className="w-4 h-4" />
                      {buff.name}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-1">
                      <span className="font-medium">
                        {formatBuffValue(buff, tauforged)}
                      </span>
                      {tauforged && (
                        <ChevronsUp className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-normal">
                      {buff.description}
                    </div>
                    {buff.notes && buff.notes.length > 0 && (
                      <ul className="mt-1 text-xs text-muted-foreground space-y-0.5 w-full">
                        {buff.notes.map((note, index) => (
                          <li
                            key={index}
                            className="text-muted-foreground/75 break-words whitespace-normal pl-3 relative"
                          >
                            <span className="absolute left-0">•</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
