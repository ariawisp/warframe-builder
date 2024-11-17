import type { ShardColor } from '@/types/ArchonShard'
import { getArchonShard } from '@/util/getArchonShard'
import Image from 'next/image'

interface ArchonShardProps {
  color: ShardColor
  tauforged: boolean
  size?: number
}

export const SHARD_SIZE = 64

export function ArchonShard({
  color,
  tauforged,
  size = SHARD_SIZE
}: ArchonShardProps) {
  const shard = getArchonShard(color, tauforged)

  return (
    <div
      className="relative"
      style={{
        width: `${SHARD_SIZE}px`,
        height: `${SHARD_SIZE}px`
      }}
    >
      <Image
        src={shard.baseImage}
        alt={shard.name}
        width={size}
        height={size}
        className="absolute top-0 left-0"
      />
      {tauforged && (
        <div className="absolute top-0 left-0">
          <Image
            src={shard.tauforgedImage}
            alt={`Tauforged ${shard.name}`}
            width={size}
            height={size}
            className="tauforged-overlay"
          />
        </div>
      )}
    </div>
  )
}
