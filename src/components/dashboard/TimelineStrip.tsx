"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { CalendarDays, AlertCircle } from "lucide-react";

const today = new Date();

const deadlines = [
  {
    id: "1",
    title: "Client Review: Wireframes",
    project: "Website Redesign",
    date: today,
    assignees: [{ name: "Alice", avatar: "", initials: "AL" }],
    status: "Due Today",
    isUrgent: true,
  },
  {
    id: "2",
    title: "Final Asset Delivery",
    project: "Marketing Campaign",
    date: addDays(today, 2),
    assignees: [
      { name: "Bob", avatar: "", initials: "BO" },
      { name: "Charlie", avatar: "", initials: "CH" },
    ],
    status: "Upcoming",
    isUrgent: false,
  },
  {
    id: "3",
    title: "Launch V2 Beta",
    project: "Mobile App",
    date: addDays(today, 5),
    assignees: [{ name: "Diana", avatar: "", initials: "DI" }],
    status: "Upcoming",
    isUrgent: false,
  },
];

export default function TimelineStrip() {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row gap-4 w-full overflow-x-auto pb-2">
      {deadlines.map((item) => (
        <div 
          key={item.id} 
          className={`flex-1 min-w-[280px] border rounded-lg p-4 flex flex-col gap-3 transition-all hover:shadow-md ${
            item.isUrgent ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/20' : 'bg-card'
          }`}
        >
          <div className="flex items-start justify-between">
            <Badge variant="outline" className={
              item.isUrgent ? 'text-rose-600 border-rose-200 dark:text-rose-400 dark:border-rose-800' : 'text-muted-foreground'
            }>
              {item.isUrgent && <AlertCircle className="w-3 h-3 mr-1" />}
              {item.status}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground font-medium">
              <CalendarDays className="w-3 h-3 mr-1" />
              {format(item.date, "MMM dd")}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{item.project}</p>
          </div>
          
          <div className="flex -space-x-2 mt-auto pt-2">
            {item.assignees.map((assignee, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-[10px]">{assignee.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
