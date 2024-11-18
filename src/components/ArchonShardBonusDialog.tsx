'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBonusDialogStore } from '@/stores/bonusDialogStore'
import { SHARD_BUFFS, type ShardBuff } from '@/types/ArchonShard'

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
        <DialogHeader>
          <DialogTitle>Select Shard Bonus</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2 p-2">
            {buffs.map((buff) => (
              <Button
                key={buff.name}
                variant="ghost"
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  onSelect?.(buff)
                  closeDialog()
                }}
              >
                <div className="flex flex-col items-start gap-1 text-left">
                  <div className="font-bold">{buff.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-medium">
                      {formatBuffValue(buff, tauforged)}
                    </span>
                    {tauforged && (
                      <span className="text-xs bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">
                        Tauforged
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {buff.description}
                  </div>
                  {buff.notes && buff.notes.length > 0 && (
                    <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                      {buff.notes.map((note, index) => (
                        <li key={index} className="text-muted-foreground/75">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
