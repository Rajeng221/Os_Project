import { Thread, ThreadPriority, ThreadState } from '@/types/thread';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Cpu, 
  MemoryStick,
  Clock,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThreadCardProps {
  thread: Thread;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: ThreadPriority) => void;
}

const stateConfig: Record<ThreadState, { label: string; className: string }> = {
  running: { label: 'Running', className: 'bg-thread-running text-success-foreground' },
  paused: { label: 'Paused', className: 'bg-thread-paused text-warning-foreground' },
  stopped: { label: 'Stopped', className: 'bg-thread-stopped text-destructive-foreground' },
  waiting: { label: 'Waiting', className: 'bg-thread-waiting text-foreground' },
  completed: { label: 'Completed', className: 'bg-primary text-primary-foreground' },
};

const priorityConfig: Record<ThreadPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'text-muted-foreground border-muted-foreground' },
  medium: { label: 'Medium', className: 'text-primary border-primary' },
  high: { label: 'High', className: 'text-warning border-warning' },
  critical: { label: 'Critical', className: 'text-destructive border-destructive' },
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const ThreadCard = ({
  thread,
  onPause,
  onResume,
  onStop,
  onDelete,
  onPriorityChange,
}: ThreadCardProps) => {
  const state = stateConfig[thread.state];
  const priority = priorityConfig[thread.priority];

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-border bg-card p-4 transition-all duration-300 animate-slide-up hover:border-primary/50',
        thread.state === 'running' && 'animate-pulse-glow border-thread-running/30'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              thread.state === 'running' && 'bg-thread-running animate-pulse',
              thread.state === 'paused' && 'bg-thread-paused',
              thread.state === 'stopped' && 'bg-thread-stopped',
              thread.state === 'waiting' && 'bg-thread-waiting',
              thread.state === 'completed' && 'bg-primary'
            )}
          />
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">
              {thread.name}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              {thread.id.slice(0, 20)}...
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', state.className)}>
            {state.label}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-6 w-auto px-2">
                <span className={cn('text-xs font-mono border px-1.5 py-0.5 rounded', priority.className)}>
                  {priority.label}
                </span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(priorityConfig).map(([key, config]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onPriorityChange(thread.id, key as ThreadPriority)}
                  className={cn('font-mono text-sm', config.className)}
                >
                  {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-2 py-1.5">
          <Cpu className="h-3.5 w-3.5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">CPU</p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {thread.cpuUsage.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-2 py-1.5">
          <MemoryStick className="h-3.5 w-3.5 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Memory</p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {thread.memoryUsage.toFixed(0)}MB
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar - Burst Time */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono text-foreground">
            {formatTime(thread.executionTime)} / {formatTime(thread.burstTime)}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              thread.state === 'completed' ? 'bg-primary' : 'bg-accent'
            )}
            style={{ width: `${Math.min(100, (thread.executionTime / thread.burstTime) * 100)}%` }}
          />
        </div>
      </div>

      {/* CPU Usage Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">CPU Usage</span>
          <span className="font-mono text-foreground">{thread.cpuUsage.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              thread.cpuUsage < 50 && 'bg-success',
              thread.cpuUsage >= 50 && thread.cpuUsage < 80 && 'bg-warning',
              thread.cpuUsage >= 80 && 'bg-destructive'
            )}
            style={{ width: `${thread.cpuUsage}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {thread.state === 'completed' ? (
          <Button
            variant="secondary"
            size="sm"
            disabled
            className="flex-1"
          >
            ✓ Completed
          </Button>
        ) : thread.state === 'running' ? (
          <Button
            variant="warning"
            size="sm"
            onClick={() => onPause(thread.id)}
            className="flex-1"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        ) : thread.state === 'paused' ? (
          <Button
            variant="success"
            size="sm"
            onClick={() => onResume(thread.id)}
            className="flex-1"
          >
            <Play className="h-4 w-4" />
            Resume
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            disabled
            className="flex-1"
          >
            <Square className="h-4 w-4" />
            Stopped
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStop(thread.id)}
          disabled={thread.state === 'stopped' || thread.state === 'completed'}
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(thread.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
