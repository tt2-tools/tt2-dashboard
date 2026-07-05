import { Title, Stack, Card, Text, Group, Avatar, Badge, Button, Divider } from '@mantine/core'
import { IconMicroscope, IconChevronRight } from '@tabler/icons-react'
import type { Player } from '../types/api'

// TODO: replace with actual data from GET /clans/{clanCode}/players
const MOCK_PLAYERS: Player[] = [
  { player_code: 'P001', name: 'WarriorX', clan_code: 'ABC123', created_at: '2026-01-15' },
  { player_code: 'P002', name: 'MageKing', clan_code: 'ABC123', created_at: '2026-02-01' },
  { player_code: 'P003', name: 'ShadowSlayer', clan_code: 'ABC123', created_at: '2026-01-20' },
  { player_code: 'P004', name: 'DragonRider', clan_code: 'ABC123', created_at: '2026-03-05' },
  { player_code: 'P005', name: 'TitanHunter', clan_code: 'ABC123', created_at: '2026-01-10' },
]

const AVATAR_COLORS = ['blue', 'violet', 'teal', 'orange', 'pink']

export default function ClanPage() {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Clan</Title>
        <Badge size="lg" variant="light">ABC123</Badge>
      </Group>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between">
          <div>
            <Text fw={600}>Research</Text>
            <Text size="xs" c="dimmed">Débloquez des améliorations pour le clan</Text>
          </div>
          <Button
            variant="light"
            leftSection={<IconMicroscope size={16} />}
            rightSection={<IconChevronRight size={14} />}
          >
            Voir la research
          </Button>
        </Group>
      </Card>

      <Stack gap="xs">
        <Text size="sm" fw={600} c="dimmed" tt="uppercase">
          Membres — {MOCK_PLAYERS.length}
        </Text>
        <Divider />
        {MOCK_PLAYERS.map((player, i) => (
          <Card
            key={player.player_code}
            withBorder
            radius="md"
            padding="md"
            style={{ cursor: 'pointer' }}
          >
            <Group justify="space-between">
              <Group gap="sm">
                <Avatar
                  size="md"
                  radius="xl"
                  color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                >
                  {player.name[0].toUpperCase()}
                </Avatar>
                <div>
                  <Text fw={600}>{player.name}</Text>
                  <Text size="xs" c="dimmed">{player.player_code}</Text>
                </div>
              </Group>
              <Text size="xs" c="dimmed">
                Depuis le {new Date(player.created_at).toLocaleDateString('fr-FR')}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
