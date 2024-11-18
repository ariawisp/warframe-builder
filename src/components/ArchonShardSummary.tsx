'use client'

import { useArchonShardStore } from '@/stores/archonShardStore'
import {
  type ShardBuff,
  type ShardColor,
  ADDITIVE_BONUSES,
  formatSummaryValue,
  getShardTextColor
} from '@/types/ArchonShard'
import { BUFF_ICONS } from './ArchonShardBonusDialog'

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
    <div className="mt-8 p-4 bg-slate-800/50 rounded-lg w-full">
      <h3 className="text-lg font-semibold mb-3">Total Bonuses</h3>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2 font-medium text-sm text-muted-foreground whitespace-nowrap">
              Bonus
            </th>
            <th className="py-2 font-medium text-sm text-muted-foreground text-right whitespace-nowrap">
              Value
            </th>
            <th className="py-2 font-medium text-sm text-muted-foreground text-right w-16 whitespace-nowrap">
              Normal
            </th>
            <th className="py-2 font-medium text-sm text-amber-500 text-right w-16 whitespace-nowrap">
              Tau
            </th>
            <th className="py-2 pl-6 font-medium text-sm text-emerald-500 text-right w-24 whitespace-nowrap">
              Bonus
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
            }) => {
              const Icon = BUFF_ICONS[name]
              const additiveBonus = ADDITIVE_BONUSES[name]
              let totalValue = value

              // Calculate additional bonus if applicable
              if (additiveBonus) {
                const bonusValue =
                  normalCount * additiveBonus.perShard +
                  tauforgedCount * additiveBonus.perTauforged
                totalValue += bonusValue
              }

              return (
                <tr
                  key={name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td
                    className={`py-2 ${getShardTextColor(color)} ${
                      hasTauforged ? 'font-semibold' : 'font-normal'
                    } whitespace-nowrap`}
                  >
                    <div className="flex items-center gap-1.5">
                      {Icon && <Icon className="w-4 h-4" />}
                      {name}
                    </div>
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <span className="font-medium">
                      {formatSummaryValue(totalValue, buff)}
                    </span>
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">
                      {normalCount > 0 && normalCount}
                    </span>
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <span className="text-sm text-amber-500">
                      {tauforgedCount > 0 && tauforgedCount}
                    </span>
                  </td>
                  <td className="py-2 pl-6 text-right whitespace-nowrap">
                    {additiveBonus && (
                      <span className="text-sm text-emerald-500">
                        +
                        {normalCount * additiveBonus.perShard +
                          tauforgedCount * additiveBonus.perTauforged}
                        %
                        {normalCount > 0 && tauforgedCount > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({normalCount}×{additiveBonus.perShard}% +{' '}
                            {tauforgedCount}×{additiveBonus.perTauforged}%)
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}
