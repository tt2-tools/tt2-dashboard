import { useState } from 'react'
import type { PartKey } from '../types/titan'
import type { RaidInfo, RaidState } from '../types/raid'
import { buildRaidInfo, buildInitialState, getLevels, TIERS } from '../utils/raid'

const DEFAULT_TIER  = TIERS[0]
const DEFAULT_LEVEL = getLevels(DEFAULT_TIER)[0]

export function useRaidState() {
  const [selectedTier,  setSelectedTier]  = useState<number>(DEFAULT_TIER)
  const [selectedLevel, setSelectedLevel] = useState<number>(DEFAULT_LEVEL)
  const [raidInfo,      setRaidInfo]      = useState<RaidInfo>(() => buildRaidInfo(DEFAULT_TIER, DEFAULT_LEVEL))
  const [raidState,     setRaidState]     = useState<RaidState>(() => buildInitialState(buildRaidInfo(DEFAULT_TIER, DEFAULT_LEVEL)))

  const selectRaid = (tier: number, level: number) => {
    const info = buildRaidInfo(tier, level)
    setRaidInfo(info)
    setRaidState(buildInitialState(info))
  }

  const handleTierChange = (value: string | null) => {
    if (!value) return
    const tier       = Number(value)
    const firstLevel = getLevels(tier)[0]
    setSelectedTier(tier)
    setSelectedLevel(firstLevel)
    selectRaid(tier, firstLevel)
  }

  const handleLevelChange = (value: string | null) => {
    if (!value) return
    const level = Number(value)
    setSelectedLevel(level)
    selectRaid(selectedTier, level)
  }

  const togglePart = (titanId: string, partKey: PartKey, field: 'disabled' | 'cursed') => {
    setRaidState((prev) => ({
      ...prev,
      [titanId]: {
        ...prev[titanId],
        [partKey]: {
          ...prev[titanId][partKey],
          [field]: !prev[titanId][partKey][field],
        },
      },
    }))
  }

  return {
    selectedTier,
    selectedLevel,
    raidInfo,
    raidState,
    handleTierChange,
    handleLevelChange,
    togglePart,
  }
}
