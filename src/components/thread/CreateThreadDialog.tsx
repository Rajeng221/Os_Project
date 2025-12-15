import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { ThreadPriority } from '@/types/thread';

interface CreateThreadDialogProps {
  onCreateThread: (name?: string, priority?: ThreadPriority, burstTime?: number) => void;
}

export const CreateThreadDialog = ({ onCreateThread }: CreateThreadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<ThreadPriority>('medium');
  const [burstTime, setBurstTime] = useState('');

  const handleCreate = () => {
    const burstTimeMs = burstTime ? parseInt(burstTime) * 1000 : undefined;
    onCreateThread(name || undefined, priority, burstTimeMs);
    setName('');
    setPriority('medium');
    setBurstTime('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="glow" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Thread</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your new thread. Leave name empty for auto-generated name.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-foreground">Thread Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Worker-1, DataProcessor"
              className="font-mono bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="priority" className="text-foreground">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as ThreadPriority)}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="low" className="text-muted-foreground">Low</SelectItem>
                <SelectItem value="medium" className="text-primary">Medium</SelectItem>
                <SelectItem value="high" className="text-warning">High</SelectItem>
                <SelectItem value="critical" className="text-destructive">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="burstTime" className="text-foreground">Burst Time (seconds)</Label>
            <Input
              id="burstTime"
              type="number"
              min="1"
              max="120"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              placeholder="Leave empty for random (10-30s)"
              className="font-mono bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="glow" onClick={handleCreate}>
            Create Thread
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
