import { getMeetings } from "@/app/actions/meetings";
import { getProjects } from "@/app/actions/projects";
import { MeetingsClient } from "./meetings-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const upcomingMeetings = await getMeetings("upcoming");
  const pastMeetings = await getMeetings("past");
  const projects = await getProjects();
  const users = await prisma.user.findMany({ select: { id: true, name: true, image: true }});

  return (
    <MeetingsClient 
      initialUpcoming={upcomingMeetings}
      initialPast={pastMeetings}
      projects={projects}
      users={users}
    />
  );
}
