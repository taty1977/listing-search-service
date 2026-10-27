# listing-search-service

A responsive frontend application for searching and browsing property listings aggregated from multiple MLS data feeds. The application provides an intuitive search experience where users can explore available properties, apply filters, and review detailed listing information through a clean, user-friendly interface.

## Features

- Keyword search (address/description) and location search (city, state name or abbreviation, ZIP)
- Filters for price range, property type, minimum bedrooms and bathrooms, and listing status, plus sorting and pagination
- Responsive listing cards and a listing detail page (desktop, tablet and mobile; on small screens the filters open in a toggle panel)
- Loading skeletons, empty states, error states with retry, a warning banner when only some feeds respond, and a 404 page
- A mock REST API (Next route handlers) backed by `src/data/sample_listings.json`, with optional artificial latency

## Stack

Everything is written in TypeScript, including the Tailwind, PostCSS and Vitest configs.

| Concern | Tooling |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| State / data | Redux Toolkit (`filtersSlice`) and RTK Query (`listingsApi`) |
| Forms | react-hook-form |
| Styling | Tailwind CSS 3, class-variance-authority (CVA), tailwind-merge |
| Tests | Vitest (Vite), Testing Library, jsdom |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest run
npm run lint       # eslint
npm run typecheck  # next typegen && tsc --noEmit
npm run build && npm start
```

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `MOCK_API_DELAY_MS` | `0` | Artificial latency for the mock API, useful for seeing the loading states |
| `NEXT_PUBLIC_LISTINGS_API_URL` | `/api` | Base URL used by RTK Query, so the UI can point at a real backend |

## Architecture

```
tokens/theme.tokens.ts      design tokens (ui_components names, Crexi-inspired values)
tailwind.preset.ts          turns tokens into :root CSS vars + var()-based utilities
src/
  app/                      routes: / (search), /listings/[source]/[id] (detail), /api/listings/**
  data/sample_listings.json mock dataset (MLS_A and MLS_B)
  lib/feeds/                multi-MLS layer: ListingFeedAdapter, registry, repository
  lib/listings/             types, normalization, search/filter/sort/paginate, formatting
  store/                    Redux store, filters slice, RTK Query API
  components/ui/            CVA primitives (Button, Input, Select, Field, Badge, Card, ...)
  components/listings/      ListingCard, ListingGrid, ListingDetail, Pagination, skeletons
  components/feedback/      EmptyState, ErrorState
  features/search/          SearchBar, FilterPanel, SortSelect, SearchResults, SearchPage
  features/listing-detail/  ListingDetailView
```

### Multiple MLS feeds

Each feed implements `ListingFeedAdapter` (`src/lib/feeds/types.ts`):

```ts
interface ListingFeedAdapter {
  readonly source: string; // e.g. "MLS_A"
  fetchListings(): Promise<RawListing[]>;
}
```

`listingRepository` fetches all registered feeds in parallel. It normalizes their records (trims and title-cases city names, maps state names to codes, takes the 5-digit ZIP, lower-cases status) and gives each listing the key `SOURCE:id`, because ids are only unique within a source. If a feed fails, the remaining results are still returned and the failed source is reported in `meta.failedSources`. To add a live feed, write an adapter and register it in `src/lib/feeds/registry.ts`; the API routes and UI stay the same.

### Mock API

`GET /api/listings` returns `{ data: Listing[], meta: { total, page, pageSize, totalPages, sources, failedSources } }`.

| Param | Example | Notes |
| --- | --- | --- |
| `q` | `garage` | keyword, matches word prefixes in address/description |
| `location` | `austin tx` | city, state (code or name), ZIP |
| `minPrice` / `maxPrice` | `500000` | returns 400 if `minPrice > maxPrice` |
| `minBeds` / `minBaths` | `3` / `1.5` | |
| `type` | `condo,townhouse` | `single_family`, `condo`, `townhouse`, `multi_family`, `land` |
| `status` | `active,pending` | `active`, `pending`, `sold` |
| `source` | `MLS_A` | |
| `lat`, `lng`, `radius` | `30.27`, `-97.74`, `10` | radius search in miles |
| `sort` | `price_asc` | `newest` (default), `price_asc`, `price_desc`, `sqft_desc` |
| `page`, `pageSize` | `1`, `9` | `pageSize` max 50 |

`GET /api/listings/:source/:id` returns a single `Listing`, or 404 if it does not exist.

### Design tokens

Tokens use the same names as the [ui_components](https://github.com/taty1977/ui_components) Tailwind preset, so utilities such as `bg-background-surface`, `text-text-secondary`, `border-border-subtle`, `bg-primary-500`, `rounded-lg`, `text-15` and `font-semibold` behave the same way in both projects. The values follow a Crexi-style commercial real-estate palette: navy text and surfaces, a bright blue for calls to action, and cool grays. `src/lib/utils/cn.ts` registers the custom scales with tailwind-merge so classes merge correctly.

## Assumptions

- The issue's data model has no property type. The `propertyType` field is used when a feed provides it; otherwise the type is inferred from the description and address, falling back to `single_family`.
- The `sample_listings.json` mentioned in the issue was not in the repository, so a 12-listing dataset that follows the data model was created. It includes overlapping ids across sources and formatting differences between sources.
