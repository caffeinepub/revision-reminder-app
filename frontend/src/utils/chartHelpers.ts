export interface ChartDataPoint {
  label: string;
  cumulative: number;
  count: number;
  timestamp: number;
}

/**
 * Converts nanosecond bigint timestamp to milliseconds number.
 */
export function nanosToMs(nanos: bigint): number {
  return Number(nanos / BigInt(1_000_000));
}

/**
 * Formats a timestamp (ms) to a short readable label.
 */
export function formatTimestampLabel(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Transforms raw study progress data into cumulative chart data points.
 * Input: Array of [Time (bigint nanoseconds), count (bigint)] tuples
 * Output: Array of ChartDataPoint with cumulative totals
 */
export function transformProgressToChartData(
  rawData: Array<[bigint, bigint]>
): ChartDataPoint[] {
  if (!rawData || rawData.length === 0) return [];

  // Sort by timestamp ascending
  const sorted = [...rawData].sort((a, b) => {
    const diff = a[0] - b[0];
    return diff < 0n ? -1 : diff > 0n ? 1 : 0;
  });

  let cumulative = 0;
  return sorted.map(([timestamp, count]) => {
    const ms = nanosToMs(timestamp);
    cumulative += Number(count);
    return {
      label: formatTimestampLabel(ms),
      cumulative,
      count: Number(count),
      timestamp: ms,
    };
  });
}
