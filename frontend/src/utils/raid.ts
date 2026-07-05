import { PART_KEYS, initialParts } from '../types/titan'
import { ARMOR_PART_TO_KEY, BODY_PART_TO_KEY } from '../constants/raid'
import type { RaidInfo, RaidState, TitanRaidInfo } from '../types/raid'
import titanData from '../assets/titan.json'
import raidSeedData from '../assets/raid_seed_20260628.json'

const titanImageLookup: Record<string, Record<string, string>> = Object.fromEntries(
  titanData.map(t => [t.name, t.part as Record<string, string>]),
)

export const TIERS = [...new Set(raidSeedData.raids.map(r => r.tier))].sort((a, b) => a - b)

export function tierLabel(tier: number): string {
  return tier === 9999 ? 'Spécial' : `Tier ${tier}`
}

export function getLevels(tier: number): number[] {
  return [...new Set(
    raidSeedData.raids.filter(r => r.tier === tier).map(r => r.level),
  )].sort((a, b) => a - b)
}

export function formatHp(hp: number): string {
  if (hp >= 1e9) return `${(hp / 1e9).toFixed(1)}B`
  if (hp >= 1e6) return `${(hp / 1e6).toFixed(1)}M`
  if (hp >= 1e3) return `${(hp / 1e3).toFixed(0)}K`
  return hp.toFixed(0)
}

export function formatBonus(amount: number): string {
  const pct = Math.round(amount * 100)
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

export function buildRaidInfo(tier: number, level: number): RaidInfo {
  const seed = raidSeedData.raids.find(r => r.tier === tier && r.level === level)
  if (!seed) return { titans: [], areaBuffs: [] }

  const titans: TitanRaidInfo[] = seed.titans.map((t, i) => {
    const hasArmor = t.parts.some(p => p.part_id.startsWith('Armor'))

    const partHp: TitanRaidInfo['partHp'] = {}
    const initialCursed: TitanRaidInfo['initialCursed'] = {}

    for (const p of t.parts) {
      const armorKey = ARMOR_PART_TO_KEY[p.part_id]
      const bodyKey  = BODY_PART_TO_KEY[p.part_id]

      if (armorKey) {
        const existing = partHp[armorKey] ?? { body: 0 }
        partHp[armorKey] = { ...existing, armor: p.total_hp }
        if ((p as { cursed?: boolean }).cursed) initialCursed[armorKey] = true
      } else if (bodyKey) {
        const existing = partHp[bodyKey] ?? {}
        partHp[bodyKey] = { ...existing, body: p.total_hp }
      }
    }

    return {
      config: {
        id: `T${i + 1}`,
        name: t.enemy_name,
        hasArmor,
        imageMap: titanImageLookup[t.enemy_name],
      },
      totalHp: t.total_hp,
      partHp,
      initialCursed,
      areaDebuffs:   (t as { area_debuffs?: TitanRaidInfo['areaDebuffs'] }).area_debuffs   ?? [],
      cursedDebuffs: (t as { cursed_debuffs?: TitanRaidInfo['cursedDebuffs'] }).cursed_debuffs ?? [],
    }
  })

  return {
    titans,
    areaBuffs: (seed as { area_buffs?: RaidInfo['areaBuffs'] }).area_buffs ?? [],
  }
}

export function buildInitialState(info: RaidInfo): RaidState {
  return Object.fromEntries(
    info.titans.map(({ config, initialCursed }) => {
      const parts = initialParts()
      for (const key of PART_KEYS) {
        if (initialCursed[key]) parts[key] = { ...parts[key], cursed: true }
      }
      return [config.id, parts]
    }),
  )
}
