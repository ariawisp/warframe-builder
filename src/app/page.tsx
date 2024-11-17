'use client';

import { ArchonShardEquip } from '@/components/ArchonShardEquip';
import { ArchonShardBonusDialog } from '@/components/ArchonShardBonusDialog';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-8">
        <div>Header breadcrumbs n stuff</div>
      </Card>
      <Card className="p-8">
        <div>Mods to go here</div>
        <div>Mods to go here line 2</div>
        <div>Mods to go here line 3</div>
        <div>Mods to go here line 4</div>
      </Card>
      <Card className="p-8">
        <ArchonShardEquip />
      </Card>
      <ArchonShardBonusDialog />
    </div>
  );
}
