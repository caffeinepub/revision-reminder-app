import { useState } from 'react';
import { Bell, CheckCircle2, RefreshCw, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDueReminders, useMarkReminderDone } from '@/hooks/useQueries';

const INTERVAL_LABELS: Record<string, { label: string; color: string }> = {
  '1-day': { label: '1 Day', color: 'bg-accent/20 text-accent-foreground border-accent/40' },
  '3-day': { label: '3 Days', color: 'bg-primary/10 text-primary border-primary/30' },
  '30-day': { label: '30 Days', color: 'bg-secondary text-secondary-foreground border-border' },
  '3-month': { label: '3 Months', color: 'bg-muted text-muted-foreground border-border' },
};

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

  const getIntervalInfo = (interval: string) => {
    return INTERVAL_LABELS[interval] ?? { label: interval, color: 'bg-muted text-muted-foreground border-border' };
  };

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
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : reminders.length === 0 ? (
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
            {reminders.length} reminder{reminders.length !== 1 ? 's' : ''} due
          </p>
          {reminders.map(([topicName, interval]) => {
            const key = `${topicName}::${interval}`;
            const isMarking = markingKey === key;
            const intervalInfo = getIntervalInfo(interval);

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 bg-background rounded-lg border border-border px-4 py-3 transition-all hover:shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent/15 shrink-0">
                    <Clock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans font-medium text-foreground text-sm truncate">{topicName}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs mt-0.5 font-sans ${intervalInfo.color}`}
                    >
                      {intervalInfo.label} review
                    </Badge>
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
