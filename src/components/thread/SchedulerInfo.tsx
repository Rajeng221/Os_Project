import { useScheduler } from '@/hooks/useScheduler';
import { Thread } from '@/types/thread';
import { Clock, Cpu, Info } from 'lucide-react';

interface SchedulerInfoProps {
  threads: Thread[];
}

export const SchedulerInfo = ({ threads }: SchedulerInfoProps) => {
  const { getSchedulerInfo, priorityWeights } = useScheduler();
  const info = getSchedulerInfo(threads);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Scheduling Algorithm</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-primary/20 text-primary rounded font-mono text-sm">
            {info.algorithm}
          </span>
        </div>

        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          {info.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Current Thread:</span>
            <span className="ml-2 text-foreground font-mono">
              {info.currentThread || 'None'}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Time Quantum:</span>
            <span className="ml-2 text-foreground font-mono">
              {info.timeQuantum}ms
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs text-muted-foreground mb-2">Priority Weights:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(priorityWeights).map(([priority, weight]) => (
              <span
                key={priority}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}
              >
                {priority}: {weight}x
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
