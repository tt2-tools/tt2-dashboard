import { Box } from '@mantine/core'
import { PART_KEYS, PART_KEY_TO_IMAGE_KEY } from '../../types/titan'
import { BodyPartButton } from './BodyPartButton'
import type { PartKey, TitanConfig, TitanParts } from '../../types/titan'
import type { PartHp } from '../../types/raid'

interface TitanBodyProps {
  titan: TitanConfig
  parts: TitanParts
  partHp: Partial<Record<PartKey, PartHp>>
  onToggle: (key: PartKey, field: 'disabled' | 'cursed') => void
}

export function TitanBody({ titan, parts, partHp, onToggle }: TitanBodyProps) {
  return (
    <Box style={{ maxWidth: '100px' }}>
      {PART_KEYS.map((key) => (
        <BodyPartButton
          key={key}
          partKey={key}
          state={parts[key]}
          hasArmor={titan.hasArmor}
          imageUrl={titan.imageMap?.[PART_KEY_TO_IMAGE_KEY[key]]}
          hp={partHp[key]}
          onToggleDisabled={() => onToggle(key, 'disabled')}
          onToggleCursed={() => onToggle(key, 'cursed')}
        />
      ))}
    </Box>
  )
}
