import { useState } from 'react';
import { Bell, CheckCircle2, RefreshCw, Loader2, Clock, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDueReminders, useMarkReminderDone } from '@/hooks/useQueries';
import { INTERVAL_DISPLAY } from '@/utils/dateHelpers';

const INTERVAL_COLORS: Record<string, string> = {
  '1-day': 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700',
  '3-day': 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700',
  '7-day': 'bg-primary/10 text-primary border-primary/30',
  '1-month': 'bg-secondary text-secondary-foreground border-border',
  '3-month': 'bg-muted text-muted-foreground border-border',
};

const INTERVAL_ORDER = ['1-day', '3-day', '7-day', '1-month', '3-month'];

function getIntervalColor(interval: string): string {
  return INTERVAL_COLORS[interval] ?? 'bg-muted text-muted-foreground border-border';
}

function getIntervalLabel(interval: string): string {
  return INTERVAL_DISPLAY[interval]?.label ?? interval;
}

function getIntervalSortIndex(interval: string): number {
  const idx = INTERVAL_ORDER.indexOf(interval);
  return idx === -1 ? 99 : idx;
}

export function DueReminders() {
  const { data: reminders = [], isLoading, refetch, isFetching } = useGetDueReminders();
  const markDoneMutation = useMarkReminderDone();
  const [markingKey, setMarkingKey] = useState<string | null>(null);

  const handleMarkDone = async (topicName: string, interval: string) => {
    const key = `${topicName}::${interval}`;
    setMarkingKey(key);
    try {
      await markDoneMutation.mutateAsync({ topicName, interval });
    } finally {
      setMarkingKey(null);
    }
  };

  // Sort reminders by interval order for consistent display
  const sortedReminders = [...reminders].sort(
    (a, b) => getIntervalSortIndex(a[1]) - getIntervalSortIndex(b[1])
  );

  return (
    <section className="bg-card rounded-xl shadow-card p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
            <Bell className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Due Reminders</h2>
            <p className="text-sm text-muted-foreground">Topics ready for revision</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 border-border text-muted-foreground hover:text-foreground font-sans"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : sortedReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <p className="font-serif text-lg font-medium text-foreground mb-1">All caught up!</p>
          <p className="text-sm text-muted-foreground font-sans max-w-xs">
            No revisions due right now. Check back later or add more topics to study.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {sortedReminders.length} reminder{sortedReminders.length !== 1 ? 's' : ''} due
          </p>
          {sortedReminders.map(([topicName, interval]) => {
            const key = `${topicName}::${interval}`;
            const isMarking = markingKey === key;
            const intervalColor = getIntervalColor(interval);
            const intervalLabel = getIntervalLabel(interval);
            const description = INTERVAL_DISPLAY[interval]?.description ?? `${interval} review`;

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 bg-background rounded-lg border border-border px-4 py-3 transition-all hover:shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent/15 shrink-0">
                    <CalendarClock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans font-medium text-foreground text-sm truncate">{topicName}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs font-sans font-semibold ${intervalColor}`}
                      >
                        {intervalLabel}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                        <Clock className="w-3 h-3" />
                        {description} — <span className="text-destructive font-medium">Due now</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleMarkDone(topicName, interval)}
                  disabled={isMarking || markDoneMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shrink-0 font-sans text-xs"
                >
                  {isMarking ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Mark Revised
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
