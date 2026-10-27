import { Card, Skeleton } from '@/components/ui';

export function ListingCardSkeleton() {
  return (
    <Card data-testid="listing-card-skeleton">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </Card>
  );
}
