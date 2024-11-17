import { create } from 'zustand'
import { ArchonShardColor } from '@/types/warframe'

export interface EquippedShard {
  color: ArchonShardColor
  tauforged: boolean
  buff?: {
    name: string
    value: {
      base: number
      tauforged: number
    }
  }
}

interface ArchonShardState {
  equippedShards: Record<number, EquippedShard | undefined>
  selectingPosition: number | null
  pendingShard: {
    position: number
    shard: EquippedShard
  } | null
  previousShard: EquippedShard | undefined
  setSelectingPosition: (position: number | null) => void
  selectShard: (position: number, shard?: EquippedShard) => void
  selectBonus: (buff: EquippedShard['buff']) => void
  cancelSelection: () => void
}

export const useArchonShardStore = create<ArchonShardState>((set) => ({
  equippedShards: {},
  selectingPosition: null,
  pendingShard: null,
  previousShard: undefined,
  setSelectingPosition: (position) =>
    set(() => ({ selectingPosition: position })),
  selectShard: (position, shard) =>
    set((state) => {
      // If selecting a new shard, store the current one as previous
      const previousShard = state.equippedShards[position]
      
      if (!shard) {
        // If removing a shard, clear it immediately
        const newEquipped = { ...state.equippedShards }
        delete newEquipped[position]
        return {
          equippedShards: newEquipped,
          selectingPosition: null,
          pendingShard: null,
          previousShard: undefined
        }
      }

      // When selecting a new shard, store it as pending and keep the previous one equipped
      return {
        selectingPosition: null,
        pendingShard: {
          position,
          shard
        },
        previousShard
      }
    }),
  selectBonus: (buff) =>
    set((state) => {
      if (!state.pendingShard) return {}

      // Commit the pending shard with the selected buff
      const newEquipped = { ...state.equippedShards }
      newEquipped[state.pendingShard.position] = {
        ...state.pendingShard.shard,
        buff
      }

      return {
        equippedShards: newEquipped,
        pendingShard: null,
        previousShard: undefined
      }
    }),
  cancelSelection: () =>
    set((state) => {
      if (state.pendingShard) {
        // If we have a pending shard and we're canceling, restore the previous shard
        const newEquipped = { ...state.equippedShards }
        if (state.previousShard) {
          newEquipped[state.pendingShard.position] = state.previousShard
        } else {
          delete newEquipped[state.pendingShard.position]
        }
        return {
          equippedShards: newEquipped,
          selectingPosition: null,
          pendingShard: null,
          previousShard: undefined
        }
      }
      
      // Just clear selection state if no pending shard
      return {
        selectingPosition: null,
        pendingShard: null,
        previousShard: undefined
      }
    })
}))
