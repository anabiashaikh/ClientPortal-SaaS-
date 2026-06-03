"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function SettingsPage() {
  const { userAvatar, setUserAvatar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const avatarSrc = mounted ? userAvatar : "https://github.com/shadcn.png";
  
  // Profile state
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("admin@example.com");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Notification state
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [notifSaved, setNotifSaved] = useState(false);

  // Appearance state
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Avatar change handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      alert("File size must be less than 1MB.");
      return;
    }

    // Validate file type
    if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      alert("Only JPG, PNG, and GIF files are allowed.");
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save profile handler
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileSaved(false);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Save notifications handler
  const handleSaveNotifications = async () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  // Update password handler
  const handleUpdatePassword = async () => {
    setPasswordError("");
    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    setPasswordSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPasswordSaving(false);
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border border-border shrink-0">
                  <img
                    key={avatarSrc}
                    src={avatarSrc}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button size="sm" type="button" onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                        fileInputRef.current.click();
                      }
                    }}>
                      Change Avatar
                    </Button>
                    <Button size="sm" variant="outline" type="button" onClick={() => setUserAvatar("https://github.com/shadcn.png")}>
                      Remove
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleAvatarChange}
                  />
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Super Admin" disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-6 gap-2">
              {profileSaved && (
                <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> Saved successfully
                </span>
              )}
              <Button onClick={handleSaveProfile} disabled={profileSaving}>
                {profileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Project Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when project status changes.</p>
                </div>
                <Switch checked={projectUpdates} onCheckedChange={(checked) => { setProjectUpdates(checked); handleSaveNotifications(); }} />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Task Assignments</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when you are assigned a task.</p>
                </div>
                <Switch checked={taskAssignments} onCheckedChange={(checked) => { setTaskAssignments(checked); handleSaveNotifications(); }} />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Mentions & Comments</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when someone mentions you.</p>
                </div>
                <Switch checked={mentions} onCheckedChange={(checked) => { setMentions(checked); handleSaveNotifications(); }} />
              </div>
            </CardContent>
            {notifSaved && (
              <CardFooter className="border-t pt-4">
                <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> Preferences saved
                </span>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* ── Appearance Tab ── */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your portal.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Preference</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className={`h-24 justify-start items-start p-4 flex flex-col gap-2 relative ${theme === "system" ? "border-2 border-primary" : ""}`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="flex gap-2 w-full items-center">
                        <div className="h-4 w-4 rounded-full bg-background border" />
                        <span className="font-medium">System</span>
                      </div>
                      <div className="w-full h-8 bg-muted rounded-md" />
                      {theme === "system" && <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />}
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-24 justify-start items-start p-4 flex flex-col gap-2 relative ${theme === "light" ? "border-2 border-primary" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex gap-2 w-full items-center">
                        <div className="h-4 w-4 rounded-full bg-white border" />
                        <span className="font-medium">Light</span>
                      </div>
                      <div className="w-full h-8 bg-slate-100 rounded-md" />
                      {theme === "light" && <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />}
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-24 justify-start items-start p-4 flex flex-col gap-2 relative bg-slate-950 text-slate-50 hover:bg-slate-900 hover:text-slate-50 ${theme === "dark" ? "border-2 border-primary" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex gap-2 w-full items-center">
                        <div className="h-4 w-4 rounded-full bg-slate-900 border border-slate-800" />
                        <span className="font-medium">Dark</span>
                      </div>
                      <div className="w-full h-8 bg-slate-800 rounded-md" />
                      {theme === "dark" && <Check className="absolute top-2 right-2 h-4 w-4 text-white" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security Tab ── */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm new password</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 gap-2">
              {passwordSaved && (
                <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> Password updated
                </span>
              )}
              <Button onClick={handleUpdatePassword} disabled={passwordSaving}>
                {passwordSaving ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
