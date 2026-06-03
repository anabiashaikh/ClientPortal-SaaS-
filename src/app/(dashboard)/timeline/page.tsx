import { getProjects } from "@/app/actions/projects";
import { TimelineClient } from "./timeline-client";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const projects = await getProjects();
  
  // Aggregate all events from all projects
  const events: any[] = [];
  
  projects.forEach((project: any) => {
    if (project.milestones) {
      project.milestones.forEach((m: any) => {
        events.push({
          id: `milestone-${m.id}`,
          title: m.name,
          project: project.name,
          date: new Date(m.date),
          status: m.completed ? "Completed" : "Upcoming",
          isUrgent: false,
          type: "Milestone",
        });
      });
    }
    
    if (project.tasks) {
      project.tasks.forEach((t: any) => {
        if (t.dueDate) {
          events.push({
            id: `task-${t.id}`,
            title: t.title,
            project: project.name,
            date: new Date(t.dueDate),
            status: t.status === "DONE" ? "Completed" : "Upcoming",
            isUrgent: t.priority === "CRITICAL" || t.priority === "HIGH",
            type: "Task",
          });
        }
      });
    }
    
    if (project.meetings) {
      project.meetings.forEach((m: any) => {
        events.push({
          id: `meeting-${m.id}`,
          title: m.title,
          project: project.name,
          date: new Date(m.date),
          status: new Date(m.date) < new Date() ? "Completed" : "Upcoming",
          isUrgent: false,
          type: "Meeting",
        });
      });
    }
  });
  
  // Sort by date ascending
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  return <TimelineClient events={events} projects={projects} />;
}
