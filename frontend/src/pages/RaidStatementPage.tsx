import {
  Title, Stack, Card, Text, Group, Grid, Badge, Divider, Select,
} from '@mantine/core'
import { IconSkull, IconShield, IconSword, IconFlame } from '@tabler/icons-react'
import { SPEC_COLORS } from '../constants/raid'
import { TIERS, tierLabel, getLevels, formatHp } from '../utils/raid'
import { useRaidState } from '../hooks/useRaidState'
import { BonusBadge } from '../components/raid/BonusBadge'
import { TitanBody } from '../components/raid/TitanBody'

export default function RaidStatementPage() {
  const {
    selectedTier,
    selectedLevel,
    raidInfo,
    raidState,
    handleTierChange,
    handleLevelChange,
    togglePart,
    countParts,
  } = useRaidState()

  const levels = getLevels(selectedTier)

  return (
    <Stack gap="lg">
      <Title order={2}>Raid Statement</Title>

      <Group align="flex-end">
        <Select
          label="Tier"
          value={String(selectedTier)}
          onChange={handleTierChange}
          data={TIERS.map(t => ({ value: String(t), label: tierLabel(t) }))}
          w={140}
          allowDeselect={false}
        />
        <Select
          label="Level"
          value={String(selectedLevel)}
          onChange={handleLevelChange}
          data={levels.map(l => ({ value: String(l), label: `Level ${l}` }))}
          w={140}
          allowDeselect={false}
          searchable
        />
      </Group>

      {raidInfo.areaBuffs.length > 0 && (
        <Card withBorder radius="md" padding="sm">
          <Group gap="xs" align="center">
            <IconFlame size={14} color="var(--mantine-color-orange-4)" />
            <Text size="xs" fw={600} c="orange.4">Buffs raid</Text>
            <Divider orientation="vertical" />
            {raidInfo.areaBuffs.map((b, i) => (
              <BonusBadge key={i} bonus={b} color="orange" />
            ))}
          </Group>
        </Card>
      )}

      <Grid>
        {raidInfo.titans.map((titanInfo) => {
          const { config, totalHp, partHp, areaDebuffs, cursedDebuffs } = titanInfo
          const specColor     = SPEC_COLORS[config.spec ?? ''] ?? 'blue'
          const disabledCount = countParts(config.id, 'disabled')
          const cursedCount   = countParts(config.id, 'cursed')

          return (
            <Grid.Col key={config.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card withBorder radius="md" padding="md" h="100%">
                <Group justify="space-between" mb={4}>
                  <Text fw={700} size="lg">{config.name}</Text>
                  {config.spec && (
                    <Badge color={specColor} variant="light">{config.spec}</Badge>
                  )}
                </Group>

                <Group gap={4} mb="xs">
                  <Text size="xs" c="dimmed">PV total :</Text>
                  <Text size="xs" fw={600} c="red.4">{formatHp(totalHp)}</Text>
                </Group>

                <Group gap="xs" mb="xs">
                  {config.hasArmor ? (
                    <Group gap={4}>
                      <IconShield size={14} color="var(--mantine-color-blue-4)" />
                      <Text size="xs" c="blue.4" fw={500}>Armure active</Text>
                      <Text size="xs" c="dimmed">— cliquez ☠ pour maudire</Text>
                    </Group>
                  ) : (
                    <Text size="xs" c="dimmed">Sans armure</Text>
                  )}
                </Group>

                {(areaDebuffs.length > 0 || cursedDebuffs.length > 0) && (
                  <Stack gap={4} mb="xs">
                    {areaDebuffs.length > 0 && (
                      <Group gap={4} align="center">
                        <IconSword size={12} color="var(--mantine-color-red-4)" />
                        <Text size="xs" c="red.4" fw={500}>Debuffs</Text>
                        {areaDebuffs.map((d, i) => (
                          <BonusBadge key={i} bonus={d} color="red" />
                        ))}
                      </Group>
                    )}
                    {cursedDebuffs.length > 0 && (
                      <Group gap={4} align="center">
                        <IconSkull size={12} color="var(--mantine-color-grape-4)" />
                        <Text size="xs" c="grape.4" fw={500}>Malédiction</Text>
                        {cursedDebuffs.map((d, i) => (
                          <BonusBadge key={i} bonus={d} color="grape" />
                        ))}
                      </Group>
                    )}
                  </Stack>
                )}

                <TitanBody
                  titan={config}
                  parts={raidState[config.id]}
                  partHp={partHp}
                  onToggle={(key, field) => togglePart(config.id, key, field)}
                />

                <Group mt="sm" gap="xs">
                  {disabledCount > 0 && (
                    <Badge size="sm" color="gray" variant="light">
                      {disabledCount} désactivée{disabledCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {cursedCount > 0 && (
                    <Badge size="sm" color="grape" variant="light">
                      <Group gap={4}>
                        <IconSkull size={10} />
                        {cursedCount} maudite{cursedCount > 1 ? 's' : ''}
                      </Group>
                    </Badge>
                  )}
                  {disabledCount === 0 && cursedCount === 0 && (
                    <Text size="xs" c="dimmed">Toutes les parties actives</Text>
                  )}
                </Group>
              </Card>
            </Grid.Col>
          )
        })}
      </Grid>
    </Stack>
  )
}
