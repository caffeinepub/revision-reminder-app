import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// ─── Topics ───────────────────────────────────────────────────────────────────

export function useGetTopics() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTopic(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['dueReminders'] });
    },
  });
}

// ─── Due Reminders ────────────────────────────────────────────────────────────

export function useGetDueReminders() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['dueReminders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDueReminders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000, // auto-refresh every minute
  });
}

export function useMarkReminderDone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topicName, interval }: { topicName: string; interval: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.markReminderDone(topicName, interval);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dueReminders'] });
      queryClient.invalidateQueries({ queryKey: ['studyProgress'] });
    },
  });
}

// ─── Study Progress ───────────────────────────────────────────────────────────

export function useGetStudyProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, bigint]>>({
    queryKey: ['studyProgress'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudyProgress();
    },
    enabled: !!actor && !isFetching,
  });
}
