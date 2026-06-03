import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  target: string;
  date: Date;
};

const activities: Activity[] = [
  {
    id: "1",
    user: { name: "Alice Smith", avatar: "", initials: "AS" },
    action: "uploaded a new version of",
    target: "Homepage_Design_v2.fig",
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: "2",
    user: { name: "Bob Jones", avatar: "", initials: "BJ" },
    action: "completed task",
    target: "Setup CI/CD Pipeline",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    user: { name: "Charlie Davis", avatar: "", initials: "CD" },
    action: "commented on",
    target: "Brand Guidelines",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "4",
    user: { name: "Diana Prince", avatar: "", initials: "DP" },
    action: "created a new project",
    target: "Marketing Campaign Q3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

export default function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8 mt-0.5">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium text-foreground">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(activity.date, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
