'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SHARD_BUFFS, type ShardBuff, type ShardColor } from '@/types/ArchonShard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useBonusDialogStore } from '@/stores/bonusDialogStore';

export function ArchonShardBonusDialog() {
  const { isOpen, color, tauforged, onSelect, closeDialog } = useBonusDialogStore()

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
                  <div className="text-sm text-muted-foreground">
                    Value: {tauforged ? buff.value.tauforged : buff.value.base}%
                  </div>
                  <div className="text-sm text-muted-foreground">{buff.description}</div>
                  {buff.notes && buff.notes.length > 0 && (
                    <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside">
                      {buff.notes.map((note, index) => (
                        <li key={index}>{note}</li>
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
