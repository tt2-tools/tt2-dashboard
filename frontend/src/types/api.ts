export interface Raid {
  raid_id: number
  clan_code: string
  enemy_id: string
  created_at: string
}

export interface Attack {
  id: number
  player_code: string
  player_name?: string
  cycle: number
  attacks_remaining: number
  total_damage: number
  attack_datetime: string
}

export interface Player {
  player_code: string
  name: string
  clan_code: string
  created_at: string
}

export interface PlayerCard {
  card_id: string
  level: number
  updated_at: string
}

export interface RaidDetail {
  raid: Raid
  attacks: Attack[]
}

export interface PlayerDetail {
  player: Player
  cards: PlayerCard[]
  attacks: Attack[]
}
