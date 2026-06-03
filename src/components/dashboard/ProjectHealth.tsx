"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const projectData = [
  { name: "Website Redesign", status: "Active", progress: 75, color: "bg-emerald-500", chartColor: "#10b981" },
  { name: "Mobile App V2", status: "At Risk", progress: 40, color: "bg-rose-500", chartColor: "#f43f5e" },
  { name: "Brand Guidelines", status: "On Hold", progress: 20, color: "bg-amber-500", chartColor: "#f59e0b" },
  { name: "Marketing Campaign", status: "Active", progress: 90, color: "bg-emerald-500", chartColor: "#10b981" },
];

const chartData = [
  { name: "Active", value: 12, color: "#10b981" },
  { name: "Completed", value: 8, color: "#3b82f6" },
  { name: "On Hold", value: 3, color: "#f59e0b" },
  { name: "At Risk", value: 2, color: "#f43f5e" },
];

export default function ProjectHealth() {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
      <div className="w-full md:w-1/3 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-2/3 space-y-4">
        {projectData.map((project) => (
          <div key={project.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{project.name}</span>
              <Badge variant="outline" className={`text-xs ${
                project.status === 'Active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' :
                project.status === 'At Risk' ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' :
                'text-amber-500 border-amber-500/20 bg-amber-500/10'
              }`}>
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={project.progress} className="h-2" />
              <span className="text-xs text-muted-foreground w-8 text-right">{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
