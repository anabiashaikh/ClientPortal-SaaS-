"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMeeting } from "@/app/actions/meetings";
import { useRouter } from "next/navigation";

interface ScheduleMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: { id: string; name: string }[];
  users: { id: string; name: string }[];
  projectId?: string;
}

export function ScheduleMeetingModal({
  open,
  onOpenChange,
  projects,
  users,
  projectId,
}: ScheduleMeetingModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [type, setType] = useState("Kickoff");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !selectedProjectId) return;

    setLoading(true);
    try {
      // Combine date and time
      const datetime = new Date(`${date}T${time}`);

      await createMeeting({
        title,
        date: datetime.toISOString(),
        duration: parseInt(duration, 10),
        type,
        projectId: selectedProjectId,
        link,
        notes,
        attendeeIds: selectedUsers,
      });

      onOpenChange(false);
      // Reset form
      setTitle("");
      setDate("");
      setTime("");
      setDuration("30");
      setType("Kickoff");
      setLink("");
      setNotes("");
      setSelectedUsers([]);
      setSelectedProjectId(projectId || "");
      router.refresh();
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription>
            Schedule a new meeting and invite team members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              placeholder="e.g. Weekly Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Select value={duration} onValueChange={(v) => setDuration(v as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration">
                    {{'15': '15 min', '30': '30 min', '45': '45 min', '60': '1 hour', '90': '1.5 hours', '120': '2 hours'}[duration] || 'Select duration'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15" label={"15 min"}>15 min</SelectItem>
                  <SelectItem value="30" label={"30 min"}>30 min</SelectItem>
                  <SelectItem value="45" label={"45 min"}>45 min</SelectItem>
                  <SelectItem value="60" label={"1 hour"}>1 hour</SelectItem>
                  <SelectItem value="90" label={"1.5 hours"}>1.5 hours</SelectItem>
                  <SelectItem value="120" label={"2 hours"}>2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type">
                    {type || 'Select type'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kickoff" label={"Kickoff"}>Kickoff</SelectItem>
                  <SelectItem value="Weekly Sync" label={"Weekly Sync"}>Weekly Sync</SelectItem>
                  <SelectItem value="Review" label={"Review"}>Review</SelectItem>
                  <SelectItem value="Ad-hoc" label={"Ad-hoc"}>Ad-hoc</SelectItem>
                  <SelectItem value="Demo" label={"Demo"}>Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Project</Label>
            <Select
              value={selectedProjectId}
              onValueChange={(v) => setSelectedProjectId(v as string)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project">
                  {projects.find(p => p.id === selectedProjectId)?.name || "Select project"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} label={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Meeting Link (Optional)</Label>
            <Input
              id="link"
              placeholder="https://meet.google.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Attendees</Label>
            <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-2 bg-muted/20">
              {users.map(user => (
                <div key={user.id} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={`user-${user.id}`} 
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`user-${user.id}`} className="font-normal cursor-pointer flex-1">
                    {user.name}
                  </Label>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-sm text-muted-foreground">No users available.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Agenda / Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What's the meeting about?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title || !date || !time || !selectedProjectId}>
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


