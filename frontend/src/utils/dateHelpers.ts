/**
 * Converts nanosecond bigint timestamp to a JS Date object.
 */
export function nanosToDate(nanos: bigint): Date {
  return new Date(Number(nanos / BigInt(1_000_000)));
}

/**
 * Maps interval labels to their day counts for computing scheduled dates.
 */
const INTERVAL_DAYS: Record<string, number> = {
  '1-day': 1,
  '3-day': 3,
  '7-day': 7,
  '1-month': 30,
  '3-month': 90,
};

/**
 * Returns the number of days for a given interval label.
 */
export function getIntervalDays(intervalLabel: string): number {
  return INTERVAL_DAYS[intervalLabel] ?? 0;
}

/**
 * Formats a Date to a readable string like "Jan 15, 2025".
 */
export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a human-readable relative time string for a due date.
 * e.g. "Due today", "Due in 3 days", "Overdue by 1 day"
 */
export function getRelativeDueLabel(dueDate: Date): string {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  const diffMs = dueDateStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays > 1) return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  const overdueDays = Math.abs(diffDays);
  if (overdueDays === 1) return 'Overdue by 1 day';
  return `Overdue by ${overdueDays} days`;
}

/**
 * Computes the scheduled due date given a creation timestamp (nanoseconds bigint)
 * and an interval label.
 */
export function computeDueDate(createdNanos: bigint, intervalLabel: string): Date {
  const createdMs = Number(createdNanos / BigInt(1_000_000));
  const days = getIntervalDays(intervalLabel);
  return new Date(createdMs + days * 24 * 60 * 60 * 1000);
}

/**
 * Human-readable display name for each interval label.
 */
export const INTERVAL_DISPLAY: Record<string, { label: string; description: string }> = {
  '1-day': { label: '1 Day', description: 'Review after 1 day' },
  '3-day': { label: '3 Days', description: 'Review after 3 days' },
  '7-day': { label: '7 Days', description: 'Review after 1 week' },
  '1-month': { label: '1 Month', description: 'Review after 1 month' },
  '3-month': { label: '3 Months', description: 'Review after 3 months' },
};

/**
 * Ordered list of all five spaced-repetition intervals.
 */
export const ALL_INTERVALS = ['1-day', '3-day', '7-day', '1-month', '3-month'] as const;
