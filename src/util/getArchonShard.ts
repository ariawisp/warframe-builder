import type { ArchonShard, ShardColor } from '@/types/ArchonShard'
import MiscItemsJson from '@warframe/json/Misc'

const colorMap: Record<ShardColor, string> = {
  azure: 'blue',
  crimson: 'red',
  amber: 'yellow',
  emerald: 'green',
  violet: 'violet',
  topaz: 'orange'
}

export function getArchonShard(
  color: ShardColor,
  tauforged: boolean
): ArchonShard {
  // Find the base (non-tauforged) variant
  const baseItem = MiscItemsJson.find((item) => {
    const colorPattern = `<Shard_${colorMap[color]}_simple>`
    const namePattern = `${color.charAt(0).toUpperCase() + color.slice(1)} Archon Shard`
    return item.name === `${colorPattern} ${namePattern}`
  })

  if (!baseItem) throw new Error(`Base variant for ${color} not found`)

  // Find the tauforged variant
  const tauforgedItem = MiscItemsJson.find((i) => {
    const colorPattern = `<Shard_${colorMap[color]}_simple>`
    const namePattern = `Tauforged ${color.charAt(0).toUpperCase() + color.slice(1)} Archon Shard`
    return i.name === `${colorPattern} ${namePattern}`
  })

  if (!tauforgedItem)
    throw new Error(`Tauforged variant for ${color} not found`)

  if (!baseItem.imageName || !tauforgedItem.imageName) {
    throw new Error(`Image name missing for ${color} shard`)
  }

  const item = tauforged ? tauforgedItem : baseItem

  return {
    name: item.name,
    description: item.description || '',
    imageName: item.imageName,
    baseImage: baseItem.imageName,
    tauforgedImage: tauforgedItem.imageName,
    color,
    tauforged
  }
}
