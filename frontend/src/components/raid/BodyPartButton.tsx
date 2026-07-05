import { Box, Tooltip, ActionIcon, Stack, Text } from '@mantine/core'
import { IconSkull } from '@tabler/icons-react'
import { PART_INFO } from '../../types/titan'
import { formatHp } from '../../utils/raid'
import type { PartKey, BodyPartState } from '../../types/titan'
import type { PartHp } from '../../types/raid'

interface BodyPartButtonProps {
  partKey: PartKey
  state: BodyPartState
  hasArmor: boolean
  imageUrl?: string
  hp?: PartHp
  onToggleDisabled: () => void
  onToggleCursed: () => void
}

export function BodyPartButton({
  partKey,
  state,
  hasArmor,
  imageUrl,
  hp,
  onToggleDisabled,
  onToggleCursed,
}: BodyPartButtonProps) {
  const info = PART_INFO[partKey]

  const tooltipContent = (
    <Stack gap={2}>
      <Text size="xs" fw={600}>{info.label}</Text>
      {hp && (
        <>
          <Text size="xs" c="dimmed">Corps : {formatHp(hp.body)}</Text>
          {hp.armor !== undefined && (
            <Text size="xs" c="blue.3">Armure : {formatHp(hp.armor)}</Text>
          )}
        </>
      )}
      <Text size="xs" c={state.disabled ? 'red.4' : 'green.4'}>
        {state.disabled ? '✗ Désactivée' : '✓ Active'}
      </Text>
      {hasArmor && (
        <Text size="xs" c={state.cursed ? 'grape.4' : 'dimmed'}>
          {state.cursed ? '☠ Armure maudite' : 'Armure normale'}
        </Text>
      )}
    </Stack>
  )

  return (
    <Box style={{ position: 'relative', gridArea: info.area }}>
      <Tooltip label={tooltipContent} withArrow position="top">
        <img
          src={imageUrl}
          onClick={onToggleDisabled}
          style={{
            opacity: state.disabled ? 0.35 : 1,
            transition: 'opacity 0.15s ease, background 0.15s ease',
            outline: state.cursed && hasArmor
              ? '2px solid var(--mantine-color-grape-5)'
              : undefined,
            maxWidth: 'inherit',
            position: 'absolute',
            top: '0',
            left: '0',
          }}
        />
      </Tooltip>

      {hasArmor && (
        <Tooltip
          label={state.cursed ? "Retirer la malédiction" : "Maudire l'armure"}
          withArrow
          position="top"
        >
          <ActionIcon
            size={18}
            radius="xl"
            variant={state.cursed ? 'filled' : 'outline'}
            color={state.cursed ? 'grape' : 'gray'}
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              zIndex: 2,
              transition: 'all 0.15s ease',
            }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCursed()
            }}
          >
            <IconSkull size={10} />
          </ActionIcon>
        </Tooltip>
      )}
    </Box>
  )
}
