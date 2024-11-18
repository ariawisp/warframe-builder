'use client'

import { useArchonShardStore } from '@/stores/archonShardStore'
import { type ShardBuff, type ShardColor } from '@/types/ArchonShard'

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

function formatSummaryValue(value: number, buff: ShardBuff): string {
  if (buff.value.isPercentage) {
    return `+${value}%`
  }

  switch (buff.name) {
    case 'Health Regeneration':
      return `${value} HP/s`
    case 'Blast Kill Health':
      return `+${value} Health per kill`
    case 'Blast Kill Shield Regen':
      return `+${value} Shields per kill`
    case 'Heat Kill Critical Chance':
      return `+${value}% per kill`
    case 'Toxin Health Recovery':
      return `+${value} Health per tick`
    case 'Initial Energy':
      return `${value}% of max`
    default:
      return `+${value}`
  }
}

export function ArchonShardSummary() {
  const { equippedShards } = useArchonShardStore()

  // Group buffs by name and sum their values
  const buffSummary = Object.values(equippedShards).reduce(
    (acc, shard) => {
      if (!shard?.buff) return acc

      const buff = shard.buff
      const existingBuff = acc.find((b) => b.name === buff.name)
      if (existingBuff) {
        existingBuff.value +=
          shard.tauforged ? buff.value.tauforged : buff.value.base
        if (shard.tauforged) {
          existingBuff.tauforgedCount++
        } else {
          existingBuff.normalCount++
        }
        existingBuff.hasTauforged = existingBuff.hasTauforged || shard.tauforged
      } else {
        acc.push({
          name: buff.name,
          value: shard.tauforged ? buff.value.tauforged : buff.value.base,
          buff: {
            name: buff.name,
            description: '',
            value: buff.value
          },
          normalCount: shard.tauforged ? 0 : 1,
          tauforgedCount: shard.tauforged ? 1 : 0,
          color: shard.color,
          hasTauforged: shard.tauforged
        })
      }
      return acc
    },
    [] as Array<{
      name: string
      value: number
      buff: ShardBuff
      normalCount: number
      tauforgedCount: number
      color: ShardColor
      hasTauforged: boolean
    }>
  )

  if (buffSummary.length === 0) {
    return null
  }

  return (
    <div className="mt-8 p-4 bg-slate-800/50 rounded-lg w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-3">Total Bonuses</h3>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2 font-medium text-sm text-muted-foreground">
              Bonus
            </th>
            <th className="py-2 font-medium text-sm text-muted-foreground text-right">
              Value
            </th>
            <th className="py-2 font-medium text-sm text-muted-foreground text-right w-16">
              Normal
            </th>
            <th className="py-2 font-medium text-sm text-amber-500 text-right w-16">
              Tau
            </th>
          </tr>
        </thead>
        <tbody>
          {buffSummary.map(
            ({
              name,
              value,
              buff,
              normalCount,
              tauforgedCount,
              color,
              hasTauforged
            }) => (
              <tr
                key={name}
                className="border-b border-border/50 last:border-0"
              >
                <td
                  className={`py-2 ${getShardTextColor(color)} ${
                    hasTauforged ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {name}
                </td>
                <td className="py-2 text-right">
                  <span className="font-medium">
                    {formatSummaryValue(value, buff)}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <span className="text-sm text-muted-foreground">
                    {normalCount > 0 && normalCount}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <span className="text-sm text-amber-500">
                    {tauforgedCount > 0 && tauforgedCount}
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
