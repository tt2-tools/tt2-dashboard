import { Badge } from '@mantine/core'
import { BONUS_LABELS } from '../../constants/raid'
import { formatBonus } from '../../utils/raid'
import type { Bonus } from '../../types/raid'

export function BonusBadge({ bonus, color }: { bonus: Bonus; color: string }) {
  const label = BONUS_LABELS[bonus.bonus_type] ?? bonus.bonus_type
  return (
    <Badge size="sm" color={color} variant="light">
      {label} {formatBonus(bonus.bonus_amount)}
    </Badge>
  )
}
