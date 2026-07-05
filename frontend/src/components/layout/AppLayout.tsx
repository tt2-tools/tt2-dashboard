import { AppShell, NavLink, Avatar, Stack, Divider, Text } from '@mantine/core'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { IconHome, IconCards, IconSword, IconUsers } from '@tabler/icons-react'

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: IconHome },
  { to: '/cards', label: 'Cards', icon: IconCards },
  { to: '/raids', label: 'Raid Statement', icon: IconSword },
  { to: '/clan', label: 'Clan', icon: IconUsers },
]

export default function AppLayout() {
  const location = useLocation()

  return (
    <AppShell navbar={{ width: 220, breakpoint: 'sm' }} padding="lg">
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm">
            TT2 Dashboard
          </Text>
        </AppShell.Section>

        <AppShell.Section grow>
          <Stack gap={4}>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                component={Link}
                to={to}
                label={label}
                leftSection={<Icon size={18} stroke={1.5} />}
                active={location.pathname.startsWith(to)}
                style={{ borderRadius: 'var(--mantine-radius-sm)' }}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Divider mb="md" />
          <NavLink
            label="Mon compte"
            leftSection={
              <Avatar size={28} radius="xl" color="blue">
                G
              </Avatar>
            }
            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
