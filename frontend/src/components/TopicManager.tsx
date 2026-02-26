import { useState } from 'react';
import { BookOpen, Plus, Loader2, BookMarked, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGetTopics, useAddTopic } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ALL_INTERVALS, INTERVAL_DISPLAY } from '@/utils/dateHelpers';

const INTERVAL_COLORS: Record<string, string> = {
  '1-day': 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700',
  '3-day': 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700',
  '7-day': 'bg-primary/10 text-primary border-primary/30',
  '1-month': 'bg-secondary text-secondary-foreground border-border',
  '3-month': 'bg-muted text-muted-foreground border-border',
};

function IntervalPills() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_INTERVALS.map((interval) => (
        <span
          key={interval}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border font-sans ${INTERVAL_COLORS[interval]}`}
        >
          {INTERVAL_DISPLAY[interval].label}
        </span>
      ))}
    </div>
  );
}

function TopicCard({ topic }: { topic: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-secondary/60 border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-secondary/80 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span className="text-sm font-sans font-medium text-foreground truncate">{topic}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary/80 font-sans">
            5 intervals
          </Badge>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/60 bg-background/50">
          <p className="text-xs text-muted-foreground font-sans mb-2">Scheduled revision intervals:</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_INTERVALS.map((interval) => (
              <span
                key={interval}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border font-sans ${INTERVAL_COLORS[interval]}`}
              >
                <span className="font-semibold">{INTERVAL_DISPLAY[interval].label}</span>
                <span className="opacity-70">·</span>
                <span className="opacity-80">{INTERVAL_DISPLAY[interval].description.replace('Review after ', '')}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TopicManager() {
  const [topicName, setTopicName] = useState('');
  const [error, setError] = useState('');

  const { data: topics = [], isLoading } = useGetTopics();
  const addTopicMutation = useAddTopic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topicName.trim();
    if (!trimmed) {
      setError('Please enter a topic name.');
      return;
    }
    setError('');
    try {
      await addTopicMutation.mutateAsync(trimmed);
      setTopicName('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('already exists')) {
        setError('This topic already exists.');
      } else {
        setError('Failed to add topic. Please try again.');
      }
    }
  };

  return (
    <section className="bg-card rounded-xl shadow-card p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">My Topics</h2>
          <p className="text-sm text-muted-foreground">Add subjects you want to revise</p>
        </div>
      </div>

      {/* Interval info banner */}
      <div className="mb-5 p-3 rounded-lg bg-primary/5 border border-primary/15">
        <p className="text-xs font-medium text-muted-foreground font-sans mb-2">
          Each topic gets reminders at 5 spaced intervals:
        </p>
        <IntervalPills />
      </div>

      {/* Add Topic Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="e.g. Monetary Policy, Indian Banking…"
            value={topicName}
            onChange={(e) => {
              setTopicName(e.target.value);
              if (error) setError('');
            }}
            className="bg-background border-border focus-visible:ring-primary/40 font-sans"
            disabled={addTopicMutation.isPending}
          />
        </div>
        <Button
          type="submit"
          disabled={addTopicMutation.isPending || !topicName.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shrink-0"
        >
          {addTopicMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Topic
        </Button>
      </form>

      {error && (
        <p className="text-sm text-destructive mb-4 mt-1">{error}</p>
      )}

      {/* Topics List */}
      <div className="mt-5">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BookMarked className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-sans text-sm">
              No topics yet. Add your first topic above to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {topics.length} topic{topics.length !== 1 ? 's' : ''} added
            </p>
            <div className="space-y-2">
              {topics.map((topic) => (
                <TopicCard key={topic} topic={topic} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
