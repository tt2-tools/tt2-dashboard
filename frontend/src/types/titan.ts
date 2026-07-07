export type PartKey =
  | 'head'
  | 'torso'
  | 'shoulder_l'
  | 'shoulder_r'
  | 'hand_l'
  | 'hand_r'
  | 'leg_l'
  | 'leg_r'

export interface BodyPartState {
  disabled: boolean
  cursed: boolean  // only relevant when titan has armor
}

export type TitanParts = Record<PartKey, BodyPartState>

export interface TitanConfig {
  id: string
  name: string
  spec?: string
  hasArmor: boolean
  imageMap?: Record<string, string>
}

export const PART_KEY_TO_IMAGE_KEY: Record<PartKey, string> = {
  head:       'ArmorHead',
  torso:      'ArmorChestUpper',
  shoulder_l: 'ArmorArmUpperLeft',
  shoulder_r: 'ArmorArmUpperRight',
  hand_l:     'ArmorHandLeft',
  hand_r:     'ArmorHandRight',
  leg_l:      'ArmorLegUpperLeft',
  leg_r:      'ArmorLegUpperRight',
}

export const PART_INFO: Record<PartKey, { label: string }> = {
  head:       { label: 'Tête' },
  torso:      { label: 'Torse' },
  shoulder_l: { label: 'Épaule G' },
  shoulder_r: { label: 'Épaule D' },
  hand_l:     { label: 'Main G' },
  hand_r:     { label: 'Main D' },
  leg_l:      { label: 'Jambe G' },
  leg_r:      { label: 'Jambe D' },
}

export const PART_KEYS: PartKey[] = [
  'head', 'torso',
  'shoulder_l', 'shoulder_r',
  'hand_l', 'hand_r',
  'leg_l', 'leg_r',
]

export const initialParts = (): TitanParts =>
  Object.fromEntries(
    PART_KEYS.map((k) => [k, { disabled: false, cursed: false }]),
  ) as TitanParts
