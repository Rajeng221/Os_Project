import { Thread, ThreadPriority } from '@/types/thread';
import { ThreadCard } from './ThreadCard';

interface ThreadListProps {
  threads: Thread[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: ThreadPriority) => void;
}

export const ThreadList = ({
  threads,
  onPause,
  onResume,
  onStop,
  onDelete,
  onPriorityChange,
}: ThreadListProps) => {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Threads</h3>
        <p className="text-muted-foreground max-w-sm">
          Create a new thread to get started with thread management.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onPause={onPause}
          onResume={onResume}
          onStop={onStop}
          onDelete={onDelete}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </div>
  );
};
