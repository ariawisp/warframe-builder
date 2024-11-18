export type ShardColor =
  | 'azure'
  | 'crimson'
  | 'amber'
  | 'emerald'
  | 'violet'
  | 'topaz'

export const SHARD_COLORS: ShardColor[] = [
  'azure',
  'crimson',
  'amber',
  'emerald',
  'violet',
  'topaz'
]

export type BuffValue = {
  base: number
  tauforged: number
  isPercentage?: boolean
  maxValue?: {
    base: number
    tauforged: number
  }
}

export type ShardBuff = {
  name: string
  description: string
  value: BuffValue
  notes?: string[]
}

export const SHARD_BUFFS: Record<ShardColor, ShardBuff[]> = {
  crimson: [
    {
      name: 'Melee Critical Damage',
      description: 'Increases Melee Critical Damage',
      value: { base: 25, tauforged: 37.5, isPercentage: true },
      notes: [
        'Critical Damage bonus is additive with similar buffs such as Organ Shatter',
        'Affects Exalted Weapons of the appropriate class, and abilities that inherit modded stats of melee weapons such as Whipclaw'
      ]
    },
    {
      name: 'Primary Status Chance',
      description: 'Increases Primary Weapon Status Chance',
      value: { base: 25, tauforged: 37.5, isPercentage: true },
      notes: [
        'Status Chance bonus is additive with similar buffs such as Rifle Aptitude',
        'Affects Exalted Weapons of the appropriate class'
      ]
    },
    {
      name: 'Secondary Critical Chance',
      description: 'Increases Secondary Weapon Critical Chance',
      value: { base: 25, tauforged: 37.5, isPercentage: true },
      notes: ['Additive with mods like Pistol Gambit']
    },
    {
      name: 'Ability Strength',
      description: 'Increases Ability Strength',
      value: { base: 10, tauforged: 15, isPercentage: true }
    },
    {
      name: 'Ability Duration',
      description: 'Increases Ability Duration',
      value: { base: 10, tauforged: 15, isPercentage: true }
    }
  ],
  amber: [
    {
      name: 'Initial Energy',
      description: 'Maximum Energy filled on spawn',
      value: { base: 30, tauforged: 45, isPercentage: true },
      notes: ['Additive with mods like Preparation']
    },
    {
      name: 'Health Orb Effectiveness',
      description: 'Increases effectiveness of Health Orbs',
      value: { base: 100, tauforged: 150, isPercentage: true },
      notes: ['Does not affect Equilibrium conversion']
    },
    {
      name: 'Energy Orb Effectiveness',
      description: 'Increases effectiveness of Energy Orbs',
      value: { base: 50, tauforged: 75, isPercentage: true }
    },
    {
      name: 'Casting Speed',
      description: 'Increases ability casting speed',
      value: { base: 25, tauforged: 37.5, isPercentage: true }
    },
    {
      name: 'Parkour Velocity',
      description: 'Increases parkour velocity',
      value: { base: 15, tauforged: 22.5, isPercentage: true }
    }
  ],
  azure: [
    {
      name: 'Health',
      description: 'Flat Health increase',
      value: { base: 150, tauforged: 225, isPercentage: false },
      notes: ['Flat value increase after all bonuses are applied']
    },
    {
      name: 'Shield Capacity',
      description: 'Flat Shield increase',
      value: { base: 150, tauforged: 225, isPercentage: false },
      notes: [
        'Flat value increase after all bonuses are applied',
        "Not eligible for Inaros, Kullervo, and Nidus, as they don't possess Shields"
      ]
    },
    {
      name: 'Energy Max',
      description: 'Flat Energy increase',
      value: { base: 50, tauforged: 75 },
      notes: ['Not available for Hildryn and Lavos']
    },
    {
      name: 'Armor',
      description: 'Flat Armor increase',
      value: { base: 150, tauforged: 225 }
    },
    {
      name: 'Health Regeneration',
      description: 'Health regenerated per second',
      value: { base: 5, tauforged: 7.5 }
    }
  ],
  emerald: [
    {
      name: 'Toxin Status Damage',
      description: 'Increases Toxin Status Effect damage',
      value: { base: 30, tauforged: 45 }
    },
    {
      name: 'Toxin Health Recovery',
      description: 'Health recovered on Toxin Status damage',
      value: { base: 2, tauforged: 3 }
    },
    {
      name: 'Corrosive Ability Damage',
      description: 'Ability Damage bonus against Corroded enemies',
      value: { base: 10, tauforged: 15 }
    },
    {
      name: 'Corrosive Stack Increase',
      description: 'Increases max Corrosive Status stacks',
      value: { base: 2, tauforged: 3 }
    }
  ],
  topaz: [
    {
      name: 'Blast Kill Health',
      description: 'Gain Health per enemy killed with Blast Damage',
      value: {
        base: 1,
        tauforged: 2,
        isPercentage: false,
        maxValue: {
          base: 300,
          tauforged: 450
        }
      },
      notes: [
        'Bonus is reset upon consuming a revive',
        'Flat value increase after all bonuses are applied'
      ]
    },
    {
      name: 'Blast Kill Shield Regen',
      description: 'Shield regenerated on Blast damage kill',
      value: { base: 5, tauforged: 7.5 }
    },
    {
      name: 'Heat Kill Critical Chance',
      description: 'Secondary Critical Chance per Heat Status kill',
      value: {
        base: 1,
        tauforged: 1.5,
        isPercentage: true,
        maxValue: {
          base: 50,
          tauforged: 75
        }
      },
      notes: [
        'Critical Chance bonus is additive with similar buffs such as Pistol Gambit',
        'Bonus is reset upon consuming a revive',
        'Critical Chance gained on kill and Maximum Critical Chance bonus stacks with each shard embedded for this bonus'
      ]
    },
    {
      name: 'Radiation Ability Damage',
      description: 'Ability Damage bonus against Irradiated enemies',
      value: { base: 10, tauforged: 15 }
    }
  ],
  violet: [
    {
      name: 'Electric Status Ability Damage',
      description: 'Ability Damage bonus against Electrified enemies',
      value: { base: 10, tauforged: 15, isPercentage: true }
    },
    {
      name: 'Electric Damage Bonus',
      description: 'Primary Electricity Damage bonus',
      value: { base: 30, tauforged: 45, isPercentage: true },
      notes: ['Additional 10%/15% per Crimson/Azure/Violet shard']
    },
    {
      name: 'Energy Melee Crit',
      description: 'Melee Critical Damage (doubles over 500 energy)',
      value: { base: 25, tauforged: 37.5, isPercentage: true }
    },
    {
      name: 'Orb Conversion',
      description: 'Health/Energy orb conversion percentage',
      value: { base: 20, tauforged: 30, isPercentage: true }
    }
  ]
}

export interface ArchonShard {
  name: string
  description: string
  imageName: string
  baseImage: string
  tauforgedImage: string
  color: ShardColor
  tauforged: boolean
}

export type AdditiveBonus = {
  perShard: number
  perTauforged: number
}

export const ADDITIVE_BONUSES: Partial<Record<string, AdditiveBonus>> = {
  'Electric Damage Bonus': {
    perShard: 10,
    perTauforged: 15
  }
}

export const getShardTextColor = (color: ShardColor): string => {
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

export function formatBuffValueCompact(
  buff: ShardBuff,
  tauforged: boolean
): string {
  const value = tauforged ? buff.value.tauforged : buff.value.base

  if (buff.value.isPercentage) {
    return `+${value}%`
  }

  // Special cases for different buff types
  switch (buff.name) {
    case 'Health Regeneration':
      return `${value}/s`
    case 'Blast Kill Health':
    case 'Blast Kill Shield Regen':
      return `+${value}/kill`
    case 'Heat Kill Critical Chance':
      return `+${value}%/kill`
    case 'Toxin Health Recovery':
      return `+${value}/tick`
    case 'Initial Energy':
    case 'Health Orb Effectiveness':
    case 'Energy Orb Effectiveness':
    case 'Casting Speed':
    case 'Parkour Velocity':
    case 'Orb Conversion':
      return `${value}%`
    case 'Electric Damage Bonus':
    case 'Ability Strength':
    case 'Ability Duration':
    case 'Electric Status Ability Damage':
    case 'Toxin Status Damage':
    case 'Corrosive Ability Damage':
    case 'Radiation Ability Damage':
      return `+${value}%`
    default:
      return `+${value}`
  }
}
