/** Optional artificial latency for the mock API (`MOCK_API_DELAY_MS`) to exercise loading states. */
export async function mockLatency() {
  const delay = Number(process.env.MOCK_API_DELAY_MS ?? 0);
  if (Number.isFinite(delay) && delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 10_000)));
  }
}
