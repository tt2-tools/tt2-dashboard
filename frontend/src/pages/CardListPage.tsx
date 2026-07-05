import { Title, Stack, Group, SimpleGrid, Card, Text, Badge, Box } from '@mantine/core'

interface CardDef {
  card_id: string
  name: string
}

interface CardGroupDef {
  id: string
  name: string
  color: string
  cols: number
  cards: CardDef[]
}

const CARD_GROUPS: CardGroupDef[] = [
  {
    id: 'melee',
    name: 'Melee',
    color: 'red',
    cols: 2,
    cards: [
      { card_id: 'M1', name: 'Shadow Clone' },
      { card_id: 'M2', name: 'Slash' },
      { card_id: 'M3', name: 'War Cry' },
      { card_id: 'M4', name: 'Mighty Strike' },
      { card_id: 'M5', name: 'Battle Cry' },
      { card_id: 'M6', name: 'Berserker' },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    color: 'green',
    cols: 1,
    cards: [
      { card_id: 'S1', name: 'Mana Surge' },
      { card_id: 'S2', name: 'Fortify' },
      { card_id: 'S3', name: 'Rally' },
    ],
  },
  {
    id: 'ranged',
    name: 'Ranged',
    color: 'blue',
    cols: 2,
    cards: [
      { card_id: 'R1', name: 'Arcane Shot' },
      { card_id: 'R2', name: 'Frost Arrow' },
      { card_id: 'R3', name: 'Lightning Bolt' },
      { card_id: 'R4', name: 'Storm Call' },
      { card_id: 'R5', name: 'Blizzard' },
      { card_id: 'R6', name: 'Thunder Strike' },
    ],
  },
]

// TODO: replace with actual player card levels from GET /players/{playerCode}
const MOCK_LEVELS: Record<string, number> = {
  M1: 5, M2: 3, M3: 7, M4: 2, M5: 8, M6: 4,
  S1: 6, S2: 1, S3: 9,
  R1: 3, R2: 5, R3: 2, R4: 7, R5: 4, R6: 6,
}

export default function CardListPage() {
  return (
    <Stack gap="lg">
      <Title order={2}>Card List</Title>

      <Group align="flex-start" gap="md" wrap="nowrap">
        {CARD_GROUPS.map((group) => (
          <Box
            key={group.id}
            p="sm"
            style={{
              border: `2px solid var(--mantine-color-${group.color}-6)`,
              borderRadius: 'var(--mantine-radius-md)',
              flex: group.cols,
            }}
          >
            <Text size="xs" fw={700} c={`${group.color}.4`} tt="uppercase" mb="sm">
              {group.name}
            </Text>
            <SimpleGrid cols={group.cols} spacing="xs">
              {group.cards.map((card) => (
                <Card key={card.card_id} withBorder padding="xs" radius="sm">
                  <Text size="xs" fw={500} mb={4}>
                    {card.name}
                  </Text>
                  <Badge size="xs" variant="light" color={group.color}>
                    Lv {MOCK_LEVELS[card.card_id] ?? '?'}
                  </Badge>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Group>
    </Stack>
  )
}
