import type { PartKey } from '../types/titan'

export const ARMOR_PART_TO_KEY: Record<string, PartKey> = {
  ArmorHead:          'head',
  ArmorChestUpper:    'torso',
  ArmorArmUpperRight: 'shoulder_r',
  ArmorArmUpperLeft:  'shoulder_l',
  ArmorLegUpperRight: 'leg_r',
  ArmorLegUpperLeft:  'leg_l',
  ArmorHandRight:     'hand_r',
  ArmorHandLeft:      'hand_l',
}

export const BODY_PART_TO_KEY: Record<string, PartKey> = {
  BodyHead:          'head',
  BodyChestUpper:    'torso',
  BodyArmUpperRight: 'shoulder_r',
  BodyArmUpperLeft:  'shoulder_l',
  BodyLegUpperRight: 'leg_r',
  BodyLegUpperLeft:  'leg_l',
  BodyHandRight:     'hand_r',
  BodyHandLeft:      'hand_l',
}

export const BONUS_LABELS: Record<string, string> = {
  AfflictedChance:         'Chance affliction',
  AfflictedDamage:         'Dégâts affliction',
  AfflictedDuration:       'Durée affliction',
  AllRaidDamage:           'Dégâts raid',
  BurstChance:             'Chance burst',
  BurstDamage:             'Dégâts burst',
  RaidAttackDuration:      'Durée attaque',
  SupportEffect:           'Effet soutien',
  AllArmsHPMult:           'HP bras',
  AllHeadHPMult:           'HP tête',
  AllLimbsHPMult:          'HP membres',
  AllTorsoHPMult:          'HP torse',
  ArmorArmsHPMult:         'HP arm. bras',
  ArmorLegsHPMult:         'HP arm. jambes',
  ArmorLimbsHPMult:        'HP arm. membres',
  ArmorTorsoHPMult:        'HP arm. torse',
  AfflictedDamagePerCurse: 'Dégâts affliction/malédiction',
  BodyDamagePerCurse:      'Dégâts corps/malédiction',
  BurstDamagePerCurse:     'Dégâts burst/malédiction',
}

export const SPEC_COLORS: Record<string, string> = {
  Shadow: 'grape',
  Fire:   'orange',
  Ice:    'cyan',
  Poison: 'green',
  Earth:  'yellow',
}
