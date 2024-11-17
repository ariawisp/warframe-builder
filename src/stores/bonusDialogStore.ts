import { create } from 'zustand'
import type { ShardBuff, ShardColor } from '@/types/ArchonShard'

interface DialogState {
  isOpen: boolean
  position: number | null
  color: ShardColor | null
  tauforged: boolean
  onSelect: ((buff: ShardBuff) => void) | null
  openDialog: (params: { position: number; color: ShardColor; tauforged: boolean; onSelect: (buff: ShardBuff) => void }) => void
  closeDialog: () => void
}

export const useBonusDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  position: null,
  color: null,
  tauforged: false,
  onSelect: null,
  openDialog: ({ position, color, tauforged, onSelect }) => {
    set({
      isOpen: true,
      position,
      color,
      tauforged,
      onSelect,
    })
  },
  closeDialog: () => {
    set((state) => ({ ...state, isOpen: false }))
  },
}))
