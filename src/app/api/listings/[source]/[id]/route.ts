import { NextResponse, type NextRequest } from 'next/server';
import { mockLatency } from '@/lib/feeds/mockLatency';
import { findListing } from '@/lib/feeds/repository';
import type { ApiError, Listing } from '@/lib/listings/types';

/** GET /api/listings/:source/:id — ids are only unique per feed, so the source is part of the path. */
export async function GET(_request: NextRequest, ctx: RouteContext<'/api/listings/[source]/[id]'>) {
  try {
    const { source, id } = await ctx.params;
    await mockLatency();
    const listing = await findListing(source, id);
    if (!listing) {
      return NextResponse.json<ApiError>({ error: { status: 404, message: 'Listing not found.' } }, { status: 404 });
    }
    return NextResponse.json<Listing>(listing);
  } catch {
    return NextResponse.json<ApiError>({ error: { status: 500, message: 'Unable to load listing.' } }, { status: 500 });
  }
}
