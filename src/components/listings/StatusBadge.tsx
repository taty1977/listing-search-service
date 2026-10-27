import { Badge, type BadgeProps } from '@/components/ui';
import { STATUS_LABELS, type ListingStatus } from '@/lib/listings/types';

const STATUS_TONES: Record<ListingStatus, BadgeProps['tone']> = {
  active: 'success',
  pending: 'warning',
  sold: 'error',
};

export function StatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
  return (
    <Badge tone={STATUS_TONES[status]} className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
