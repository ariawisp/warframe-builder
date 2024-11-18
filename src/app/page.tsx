'use client'

import { ArchonShardBonusDialog } from '@/components/ArchonShardBonusDialog'
import { ArchonShardEquip } from '@/components/ArchonShardEquip'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="p-8">
        <div>Header breadcrumbs n stuff</div>
      </Card>
      <Card className="p-8">
        <div>Mods to go here</div>
        <div>Mods to go here line 2</div>
        <div>Mods to go here line 3</div>
        <div>Mods to go here line 4</div>
      </Card>
      <Card className="p-8 max-w-2xl">
        <ArchonShardEquip />
      </Card>
      <ArchonShardBonusDialog />
    </div>
  )
}
