import { combineSlices, configureStore } from '@reduxjs/toolkit';
import filtersSlice from './filtersSlice';
import { listingsApi } from './listingsApi';

const rootReducer = combineSlices(filtersSlice, listingsApi);
export type RootState = ReturnType<typeof rootReducer>;

/** A store per request/test (Next.js App Router recommendation: no module-level singleton). */
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(listingsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
