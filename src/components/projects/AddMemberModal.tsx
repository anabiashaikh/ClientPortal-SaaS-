"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTeamMember } from "@/app/actions/projects";
import { getUsers } from "@/app/actions/users";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddMemberModal({
  projectId,
  existingMemberIds,
}: {
  projectId: string;
  existingMemberIds: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("none");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (open) {
      getUsers().then((allUsers) => {
        // Filter out users already on the team
        const available = allUsers.filter(
          (u: any) => !existingMemberIds.includes(u.id)
        );
        setUsers(available);
      });
    }
  }, [open, existingMemberIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId === "none") return;

    setLoading(true);
    try {
      await addTeamMember({
        projectId,
        userId: selectedUserId,
        role: role || undefined,
      });

      setOpen(false);
      setSelectedUserId("none");
      setRole("");
      router.refresh();
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add team member. They may already be on the team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline" className="gap-1">
            <Users className="h-3 w-3" /> Add Member
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[380px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add an existing user to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>
                User <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedUserId}
                onValueChange={(v) => setSelectedUserId(v as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user">
                    {selectedUserId === "none" ? "Select a user..." : users.find(u => u.id === selectedUserId)?.name || users.find(u => u.id === selectedUserId)?.email || "Select user"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" label={"Select a user..."}>Select a user...</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id} label={user.name || user.email || "Unknown"}>
                      {user.name || user.email || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {users.length === 0 && open && (
                <p className="text-xs text-muted-foreground">
                  No available users to add.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role in Project</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Designer, Backend Dev"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedUserId === "none"}
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

