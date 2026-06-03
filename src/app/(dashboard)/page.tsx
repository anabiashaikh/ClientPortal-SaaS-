import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, Users, Files, ArrowUpRight, ArrowDownRight } from "lucide-react";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProjectHealth from "@/components/dashboard/ProjectHealth";
import TimelineStrip from "@/components/dashboard/TimelineStrip";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  try {
    const [projectCount, taskCount, meetingCount, assetCount] = await Promise.all([
      prisma.project.count(),
      prisma.task.count({ where: { status: { not: "DONE" } } }),
      prisma.meeting.count({ where: { date: { gte: new Date() } } }),
      prisma.asset.count(),
    ]);
    return { projectCount, taskCount, meetingCount, assetCount };
  } catch (e) {
    // fallback if tables don't exist yet
    return { projectCount: 0, taskCount: 0, meetingCount: 0, assetCount: 0 };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const { projectCount, taskCount, meetingCount, assetCount } = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening across your projects today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Live
              </span>
              from your database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCount}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-rose-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Live
              </span>
              not yet completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingCount}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Live
              </span>
              scheduled ahead
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Files className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetCount}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Live
              </span>
              files uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Project Health Overview */}
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Project Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ProjectHealth />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 max-h-[350px] overflow-y-auto">
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines Strip */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
        <TimelineStrip />
      </div>
    </div>
  );
}
