import type { PartKey, TitanConfig, TitanParts } from './titan'

export interface PartHp { body: number; armor?: number }
export interface Bonus  { bonus_type: string; bonus_amount: number }

export interface TitanRaidInfo {
  config: TitanConfig
  totalHp: number
  partHp: Partial<Record<PartKey, PartHp>>
  initialCursed: Partial<Record<PartKey, boolean>>
  areaDebuffs: Bonus[]
  cursedDebuffs: Bonus[]
}

export interface RaidInfo {
  titans: TitanRaidInfo[]
  areaBuffs: Bonus[]
}

export type RaidState = Record<string, TitanParts>
