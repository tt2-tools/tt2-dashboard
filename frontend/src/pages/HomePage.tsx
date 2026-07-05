import { Grid, Card, Title, Text, Stack, Group, Badge, Table, ScrollArea } from '@mantine/core'
import { IconFlame, IconHistory, IconClipboardList, IconChevronRight } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import type { Raid, Attack } from '../types/api'

const MOCK_RAID: Raid = {
  raid_id: 42,
  clan_code: 'ABC123',
  enemy_id: 'Ogre_titan_6',
  created_at: '2026-06-25T10:00:00Z',
}

const MOCK_ATTACKS: Attack[] = [
  { id: 1, player_code: 'P001', player_name: 'WarriorX', cycle: 1, attacks_remaining: 0, total_damage: 1_250_000, attack_datetime: '2026-06-25T10:05:00Z' },
  { id: 2, player_code: 'P002', player_name: 'MageKing', cycle: 1, attacks_remaining: 2, total_damage: 980_000, attack_datetime: '2026-06-25T10:08:00Z' },
  { id: 3, player_code: 'P003', player_name: 'ShadowSlayer', cycle: 2, attacks_remaining: 0, total_damage: 2_100_000, attack_datetime: '2026-06-25T10:12:00Z' },
  { id: 4, player_code: 'P004', player_name: 'DragonRider', cycle: 2, attacks_remaining: 1, total_damage: 1_750_000, attack_datetime: '2026-06-25T10:15:00Z' },
  { id: 5, player_code: 'P005', player_name: 'TitanHunter', cycle: 3, attacks_remaining: 0, total_damage: 3_200_000, attack_datetime: '2026-06-25T10:20:00Z' },
]

const ACTION_CARDS = [
  { label: 'Heatmap', description: 'Activité par heure', icon: IconFlame, color: 'orange' },
  { label: 'Attack History', description: 'Historique des attaques', icon: IconHistory, color: 'blue' },
  { label: 'Attack Logs', description: 'Logs détaillés', icon: IconClipboardList, color: 'green' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const totalDamage = MOCK_ATTACKS.reduce((sum, a) => sum + a.total_damage, 0)

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Home</Title>
        <Badge size="lg" variant="light">Clan ABC123</Badge>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Group justify="space-between" mb="md">
              <Title order={4}>Raid Statement</Title>
              <Group
                gap={4}
                style={{ cursor: 'pointer', color: 'var(--mantine-color-blue-4)' }}
                onClick={() => navigate('/raids')}
              >
                <Text size="sm">Voir plus</Text>
                <IconChevronRight size={14} />
              </Group>
            </Group>

            <Group mb="md" gap="xl">
              <div>
                <Text size="xs" c="dimmed">Raid ID</Text>
                <Text fw={600}>#{MOCK_RAID.raid_id}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Titan</Text>
                <Text fw={600}>{MOCK_RAID.enemy_id}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Damage total</Text>
                <Text fw={600}>{(totalDamage / 1_000_000).toFixed(2)}M</Text>
              </div>
            </Group>

            <ScrollArea h={220}>
              <Table highlightOnHover striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Joueur</Table.Th>
                    <Table.Th>Cycle</Table.Th>
                    <Table.Th>Restantes</Table.Th>
                    <Table.Th>Dommages</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {MOCK_ATTACKS.map((a) => (
                    <Table.Tr key={a.id}>
                      <Table.Td>{a.player_name}</Table.Td>
                      <Table.Td>Cycle {a.cycle}</Table.Td>
                      <Table.Td>{a.attacks_remaining}</Table.Td>
                      <Table.Td>{(a.total_damage / 1_000_000).toFixed(2)}M</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md" h="100%">
            {ACTION_CARDS.map(({ label, description, icon: Icon, color }) => (
              <Card
                key={label}
                withBorder
                radius="md"
                padding="lg"
                style={{ cursor: 'pointer', flex: 1 }}
              >
                <Group>
                  <Icon size={32} color={`var(--mantine-color-${color}-5)`} />
                  <div>
                    <Text fw={600}>{label}</Text>
                    <Text size="xs" c="dimmed">{description}</Text>
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
