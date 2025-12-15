import { Button } from '@/components/ui/button';
import { CreateThreadDialog } from './CreateThreadDialog';
import { ThreadPriority } from '@/types/thread';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreadControlsProps {
  isSimulationRunning: boolean;
  onCreateThread: (name?: string, priority?: ThreadPriority) => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onStopAll: () => void;
  onToggleSimulation: () => void;
}

export const ThreadControls = ({
  isSimulationRunning,
  onCreateThread,
  onPauseAll,
  onResumeAll,
  onStopAll,
  onToggleSimulation,
}: ThreadControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CreateThreadDialog onCreateThread={onCreateThread} />
      
      <div className="h-8 w-px bg-border" />
      
      <Button variant="success" size="sm" onClick={onResumeAll} className="gap-2">
        <Play className="h-4 w-4" />
        Resume All
      </Button>
      
      <Button variant="warning" size="sm" onClick={onPauseAll} className="gap-2">
        <Pause className="h-4 w-4" />
        Pause All
      </Button>
      
      <Button variant="destructive" size="sm" onClick={onStopAll} className="gap-2">
        <Square className="h-4 w-4" />
        Stop All
      </Button>
      
      <div className="h-8 w-px bg-border" />
      
      <Button
        variant={isSimulationRunning ? 'outline' : 'secondary'}
        size="sm"
        onClick={onToggleSimulation}
        className="gap-2"
      >
        <RefreshCw className={cn('h-4 w-4', isSimulationRunning && 'animate-spin-slow')} />
        {isSimulationRunning ? 'Pause Simulation' : 'Start Simulation'}
      </Button>
      
      <div className="flex items-center gap-2 ml-auto">
        <Activity className={cn(
          'h-4 w-4 transition-colors',
          isSimulationRunning ? 'text-success animate-pulse' : 'text-muted-foreground'
        )} />
        <span className="text-sm text-muted-foreground font-mono">
          {isSimulationRunning ? 'LIVE' : 'PAUSED'}
        </span>
      </div>
    </div>
  );
};
