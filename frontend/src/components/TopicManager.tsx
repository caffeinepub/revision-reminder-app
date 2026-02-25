import { useState } from 'react';
import { BookOpen, Plus, Loader2, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGetTopics, useAddTopic } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

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
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-2 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {topic}
                  <Badge variant="outline" className="text-xs ml-1 border-primary/30 text-primary/80 font-sans">
                    4 intervals
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
