import { Thread } from '@/types/thread';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ThreadTimelineProps {
  threads: Thread[];
}

const stateColors: Record<string, string> = {
  running: 'bg-cyan-500',
  paused: 'bg-yellow-500',
  stopped: 'bg-red-500',
  waiting: 'bg-purple-500',
  completed: 'bg-green-500',
};

const priorityBorders: Record<string, string> = {
  low: 'border-l-slate-400',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-400',
  critical: 'border-l-red-400',
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
};

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

const exportToJSON = (threads: Thread[]) => {
  const data = threads.map(t => ({
    id: t.id,
    name: t.name,
    state: t.state,
    priority: t.priority,
    cpuUsage: t.cpuUsage.toFixed(2),
    memoryUsage: t.memoryUsage.toFixed(2),
    startTime: t.startTime.toISOString(),
    executionTime: t.executionTime,
    burstTime: t.burstTime,
    progress: ((t.executionTime / t.burstTime) * 100).toFixed(1),
  }));
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thread-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Exported as JSON');
};

const exportToCSV = (threads: Thread[]) => {
  const headers = ['ID', 'Name', 'State', 'Priority', 'CPU Usage (%)', 'Memory (MB)', 'Start Time', 'Execution Time (ms)', 'Burst Time (ms)', 'Progress (%)'];
  const rows = threads.map(t => [
    t.id,
    t.name,
    t.state,
    t.priority,
    t.cpuUsage.toFixed(2),
    t.memoryUsage.toFixed(2),
    t.startTime.toISOString(),
    t.executionTime,
    t.burstTime,
    ((t.executionTime / t.burstTime) * 100).toFixed(1),
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thread-data-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Exported as CSV');
};

export const ThreadTimeline = ({ threads }: ThreadTimelineProps) => {
  // Sort threads by start time (newest first)
  const sortedThreads = [...threads].sort(
    (a, b) => b.startTime.getTime() - a.startTime.getTime()
  );

  // Calculate time range for visualization
  const now = Date.now();
  const earliestStart = threads.length > 0 
    ? Math.min(...threads.map(t => t.startTime.getTime()))
    : now;
  const timeRange = now - earliestStart;
  const maxRange = Math.max(timeRange, 60000); // At least 1 minute range

  const getBarWidth = (thread: Thread) => {
    const duration = thread.state === 'completed' 
      ? thread.executionTime 
      : (now - thread.startTime.getTime());
    return Math.max(5, (duration / maxRange) * 100);
  };

  const getBarOffset = (thread: Thread) => {
    const offset = thread.startTime.getTime() - earliestStart;
    return (offset / maxRange) * 100;
  };

  if (threads.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-mono text-foreground flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Execution Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No threads to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-foreground flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Execution Timeline
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToJSON(threads)}
              className="font-mono text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(threads)}
              className="font-mono text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono">
          <span>{formatTime(new Date(earliestStart))}</span>
          <span>{formatTime(new Date(now))}</span>
        </div>

        {/* Timeline background with grid */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex">
            {[0, 25, 50, 75, 100].map((pos) => (
              <div
                key={pos}
                className="border-l border-border/30"
                style={{ left: `${pos}%`, position: 'absolute', height: '100%' }}
              />
            ))}
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {sortedThreads.map((thread) => (
              <div key={thread.id} className="flex items-center gap-3">
                {/* Thread name */}
                <div className="w-24 flex-shrink-0">
                  <span className="text-xs font-mono text-foreground truncate block">
                    {thread.name}
                  </span>
                </div>

                {/* Timeline bar */}
                <div className="flex-1 h-6 bg-secondary/50 rounded relative overflow-hidden">
                  {/* Grid lines */}
                  {[25, 50, 75].map((pos) => (
                    <div
                      key={pos}
                      className="absolute top-0 bottom-0 border-l border-border/20"
                      style={{ left: `${pos}%` }}
                    />
                  ))}
                  
                  {/* Execution bar */}
                  <div
                    className={`absolute top-1 bottom-1 rounded ${stateColors[thread.state]} border-l-4 ${priorityBorders[thread.priority]} transition-all duration-500`}
                    style={{
                      left: `${getBarOffset(thread)}%`,
                      width: `${getBarWidth(thread)}%`,
                      minWidth: '8px',
                    }}
                  >
                    {/* Pulse animation for running threads */}
                    {thread.state === 'running' && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse rounded" />
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatDuration(thread.executionTime)}
                  </span>
                </div>

                {/* State indicator */}
                <div className="w-20 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                    thread.state === 'completed' ? 'bg-green-500/20 text-green-400' :
                    thread.state === 'running' ? 'bg-cyan-500/20 text-cyan-400' :
                    thread.state === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                    thread.state === 'stopped' ? 'bg-red-500/20 text-red-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {thread.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyan-500" />
            <span className="text-muted-foreground">Running</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-muted-foreground">Paused</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-muted-foreground">Stopped</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
