import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Badge, Card, Skeleton } from '@/components/ui';
import { formatCityLine, formatListedDate, formatNumber, formatPrice, pricePerSqft } from '@/lib/listings/format';
import { PROPERTY_TYPE_LABELS, STATUS_LABELS, type Listing } from '@/lib/listings/types';
import { ListingMedia } from './ListingMedia';
import { StatusBadge } from './StatusBadge';

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-filled-input-bg p-3">
      <dt className="text-12 font-medium uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="text-15 font-semibold text-text-primary">{value}</dd>
    </div>
  );
}

export function ListingDetail({ listing }: { listing: Listing }) {
  const perSqft = pricePerSqft(listing);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`;

  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <ListingMedia listing={listing} className="aspect-[16/9] w-full rounded-lg" />

        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={listing.status} />
            <Badge>{PROPERTY_TYPE_LABELS[listing.propertyType]}</Badge>
          </div>
          <h1 className="text-24 font-bold leading-28 text-text-primary md:text-28 md:leading-38">{listing.address}</h1>
          <p className="flex items-center gap-1 text-15 text-text-secondary">
            <MapPinIcon className="h-5 w-5 shrink-0" aria-hidden />
            {formatCityLine(listing)}
          </p>
        </header>

        <section aria-labelledby="facts-heading" className="flex flex-col gap-3">
          <h2 id="facts-heading" className="text-18 font-semibold">
            Property facts
          </h2>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Detail label="Bedrooms" value={String(listing.bedrooms)} />
            <Detail label="Bathrooms" value={String(listing.bathrooms)} />
            <Detail label="Square feet" value={listing.sqft > 0 ? formatNumber(listing.sqft) : '—'} />
            <Detail label="Price / sqft" value={perSqft ? formatPrice(perSqft) : '—'} />
            <Detail label="Property type" value={PROPERTY_TYPE_LABELS[listing.propertyType]} />
            <Detail label="Status" value={STATUS_LABELS[listing.status]} />
          </dl>
        </section>

        <section aria-labelledby="description-heading" className="flex flex-col gap-3">
          <h2 id="description-heading" className="text-18 font-semibold">
            Description
          </h2>
          <p className="text-15 leading-22 text-text-secondary">{listing.description || 'No description provided.'}</p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Card padding="lg" className="flex flex-col gap-4">
          <div>
            <p className="text-13 font-medium text-text-muted">List price</p>
            <p className="text-28 font-bold leading-38 text-text-primary">{formatPrice(listing.price)}</p>
          </div>
          <dl className="flex flex-col gap-2 border-t border-divider pt-4 text-13">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Listed</dt>
              <dd className="flex items-center gap-1 font-medium">
                <CalendarIcon className="h-4 w-4" aria-hidden />
                {formatListedDate(listing.listedDate)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Source feed</dt>
              <dd className="font-medium">{listing.source}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Listing ID</dt>
              <dd className="font-medium">{listing.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Coordinates</dt>
              <dd className="font-medium">
                {listing.latitude.toFixed(4)}, {listing.longitude.toFixed(4)}
              </dd>
            </div>
          </dl>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary-500 px-4 text-15 font-semibold text-text-inverse hover:bg-primary-600"
          >
            <MapPinIcon className="h-5 w-5" aria-hidden />
            View on map
          </a>
        </Card>
      </aside>
    </article>
  );
}

export function ListingDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" role="status" aria-label="Loading listing">
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-[16/9] w-full rounded-lg" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
