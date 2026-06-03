import { getTasks } from "@/app/actions/tasks";
import { getProjects } from "@/app/actions/projects";
import { getUsers } from "@/app/actions/users";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const [tasks, projects, users] = await Promise.all([
    getTasks(),
    getProjects(),
    getUsers(),
  ]);

  return <TasksClient initialTasks={tasks} projects={projects} users={users} />;
}
