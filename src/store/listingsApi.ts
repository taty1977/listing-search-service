import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toSearchParams } from '@/lib/listings/query';
import type { Listing, ListingQuery, ListingSearchResponse } from '@/lib/listings/types';

export const LISTINGS_API_BASE_URL = process.env.NEXT_PUBLIC_LISTINGS_API_URL ?? '/api';

export const listingsApi = createApi({
  reducerPath: 'listingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: LISTINGS_API_BASE_URL }),
  tagTypes: ['Listing'],
  endpoints: (build) => ({
    searchListings: build.query<ListingSearchResponse, ListingQuery>({
      query: (query) => `listings?${toSearchParams(query).toString()}`,
      providesTags: (result) => [
        ...(result?.data.map((listing) => ({ type: 'Listing' as const, id: listing.key })) ?? []),
        { type: 'Listing', id: 'LIST' },
      ],
    }),
    getListing: build.query<Listing, { source: string; id: string }>({
      query: ({ source, id }) => `listings/${encodeURIComponent(source)}/${encodeURIComponent(id)}`,
      providesTags: (result) => (result ? [{ type: 'Listing', id: result.key }] : []),
    }),
  }),
});

export const { useSearchListingsQuery, useGetListingQuery } = listingsApi;
