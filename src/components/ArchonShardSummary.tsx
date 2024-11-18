'use client'

import { useArchonShardStore } from '@/stores/archonShardStore'
import {
  type ShardBuff,
  type ShardColor,
  ADDITIVE_BONUSES,
  formatSummaryValue,
  getShardTextColor,
  SHARD_COLORS
} from '@/types/ArchonShard'
import { BUFF_ICONS } from './ArchonShardBonusDialog'

// Helper function to calculate Electric Damage bonus
function calculateElectricDamageBonus(
  normalCount: number,
  tauforgedCount: number,
  relevantShardCounts: number,
  additiveBonus: { perShard: number; perTauforged: number }
) {
  return (
    normalCount * additiveBonus.perShard * relevantShardCounts +
    tauforgedCount * additiveBonus.perTauforged * relevantShardCounts
  )
}

// Component for bonus description text
function BonusDescription({
  normalCount,
  tauforgedCount,
  additiveBonus,
  relevantColors,
  shardCounts
}: {
  normalCount: number
  tauforgedCount: number
  additiveBonus: { perShard: number; perTauforged: number }
  relevantColors: readonly ShardColor[]
  shardCounts: Record<ShardColor, { normal: number; tauforged: number }>
}) {
  const parts: string[] = []

  if (normalCount > 0) {
    parts.push(
      `${normalCount}× normal (+${additiveBonus.perShard}%) × ${relevantColors
        .map(
          (color) =>
            `${color}: ${shardCounts[color].normal + shardCounts[color].tauforged}`
        )
        .join(' + ')}`
    )
  }

  if (tauforgedCount > 0) {
    parts.push(
      `${tauforgedCount}× tauforged (+${additiveBonus.perTauforged}%) × ${relevantColors
        .map(
          (color) =>
            `${color}: ${shardCounts[color].normal + shardCounts[color].tauforged}`
        )
        .join(' + ')}`
    )
  }

  return (
    <span className="text-xs text-muted-foreground ml-1">
      ({parts.join(' + ')})
    </span>
  )
}

// Table row component
function BuffRow({
  buff,
  counts,
  color,
  hasTauforged,
  totalValue,
  additiveBonus,
  relevantColors,
  shardCounts
}: {
  buff: ShardBuff
  counts: { normalCount: number; tauforgedCount: number }
  color: ShardColor
  hasTauforged: boolean
  totalValue: number
  additiveBonus?: { perShard: number; perTauforged: number }
  relevantColors?: readonly ShardColor[]
  shardCounts?: Record<ShardColor, { normal: number; tauforged: number }>
}) {
  const Icon = BUFF_ICONS[buff.name]
  const { normalCount, tauforgedCount } = counts

  return (
    <tr className="border-b border-border/50 last:border-0">
      <td
        className={`py-2 ${getShardTextColor(color)} ${hasTauforged ? 'font-semibold' : 'font-normal'} whitespace-nowrap`}
      >
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4" />}
          {buff.name}
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
        {additiveBonus &&
          buff.name === 'Electric Damage Bonus' &&
          relevantColors &&
          shardCounts && (
            <span className="text-sm text-emerald-500">
              +
              {calculateElectricDamageBonus(
                normalCount,
                tauforgedCount,
                relevantColors.reduce(
                  (sum, color) =>
                    sum +
                    shardCounts[color].normal +
                    shardCounts[color].tauforged,
                  0
                ),
                additiveBonus
              )}
              %
              <BonusDescription
                normalCount={normalCount}
                tauforgedCount={tauforgedCount}
                additiveBonus={additiveBonus}
                relevantColors={relevantColors}
                shardCounts={shardCounts}
              />
            </span>
          )}
      </td>
    </tr>
  )
}

export function ArchonShardSummary() {
  const { equippedShards } = useArchonShardStore()
  const relevantColors = ['crimson', 'azure', 'violet'] as const

  // Count shards by color
  const shardCounts = Object.values(equippedShards).reduce(
    (acc, shard) => {
      if (!shard) return acc
      const type = shard.tauforged ? 'tauforged' : 'normal'
      acc[shard.color][type]++
      return acc
    },
    Object.fromEntries(
      SHARD_COLORS.map((color) => [color, { normal: 0, tauforged: 0 }])
    ) as Record<ShardColor, { normal: number; tauforged: number }>
  )

  // Group and sum buffs
  const buffSummary = Object.values(equippedShards).reduce(
    (acc, shard) => {
      if (!shard?.buff) return acc

      const existingBuff = acc.find((b) => b.name === shard.buff?.name)
      const value =
        shard.tauforged ? shard.buff.value.tauforged : shard.buff.value.base

      if (existingBuff) {
        existingBuff.value += value
        existingBuff[shard.tauforged ? 'tauforgedCount' : 'normalCount']++
        existingBuff.hasTauforged ||= shard.tauforged
      } else {
        acc.push({
          name: shard.buff.name,
          value,
          buff: shard.buff,
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

  if (buffSummary.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-lg w-full">
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
          {buffSummary.map((buffData) => {
            const additiveBonus = ADDITIVE_BONUSES[buffData.name]
            let totalValue = buffData.value

            if (additiveBonus && buffData.name === 'Electric Damage Bonus') {
              const relevantShardCount = relevantColors.reduce(
                (sum, color) =>
                  sum +
                  shardCounts[color].normal +
                  shardCounts[color].tauforged,
                0
              )
              totalValue += calculateElectricDamageBonus(
                buffData.normalCount,
                buffData.tauforgedCount,
                relevantShardCount,
                additiveBonus
              )
            }

            return (
              <BuffRow
                key={buffData.name}
                buff={buffData.buff}
                counts={{
                  normalCount: buffData.normalCount,
                  tauforgedCount: buffData.tauforgedCount
                }}
                color={buffData.color}
                hasTauforged={buffData.hasTauforged}
                totalValue={totalValue}
                additiveBonus={additiveBonus}
                relevantColors={relevantColors}
                shardCounts={shardCounts}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
