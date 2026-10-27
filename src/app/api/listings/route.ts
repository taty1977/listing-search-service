import { NextResponse, type NextRequest } from 'next/server';
import { mockLatency } from '@/lib/feeds/mockLatency';
import { findListings } from '@/lib/feeds/repository';
import { parseListingQuery } from '@/lib/listings/query';
import type { ApiError, ListingSearchResponse } from '@/lib/listings/types';

/**
 * GET /api/listings
 * Query params: q, location, minPrice, maxPrice, minBeds, minBaths, type (csv), status (csv),
 * source (csv), lat, lng, radius (miles), sort, page, pageSize.
 */
export async function GET(request: NextRequest) {
  try {
    const query = parseListingQuery(request.nextUrl.searchParams);
    if (query.minPrice !== undefined && query.maxPrice !== undefined && query.minPrice > query.maxPrice) {
      return NextResponse.json<ApiError>(
        { error: { status: 400, message: 'minPrice must be less than or equal to maxPrice.' } },
        { status: 400 },
      );
    }
    await mockLatency();
    return NextResponse.json<ListingSearchResponse>(await findListings(query));
  } catch {
    return NextResponse.json<ApiError>({ error: { status: 500, message: 'Unable to load listings.' } }, { status: 500 });
  }
}
