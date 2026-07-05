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

export const PART_INFO: Record<PartKey, { label: string; short: string; area: string }> = {
  head:       { label: 'Tête',     short: 'Tête',   area: 'head' },
  torso:      { label: 'Torse',    short: 'Torse',  area: 'torso' },
  shoulder_l: { label: 'Épaule G', short: 'Ép. G',  area: 'shl' },
  shoulder_r: { label: 'Épaule D', short: 'Ép. D',  area: 'shr' },
  hand_l:     { label: 'Main G',   short: 'Main G', area: 'hnl' },
  hand_r:     { label: 'Main D',   short: 'Main D', area: 'hnr' },
  leg_l:      { label: 'Jambe G',  short: 'Jb. G',  area: 'lgl' },
  leg_r:      { label: 'Jambe D',  short: 'Jb. D',  area: 'lgr' },
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
