"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, TrendingUp, BarChart3, PieChart, Plus, Pencil, Trash2, LineChart as LineChartIcon } from "lucide-react";
import { saveMonthlyRevenue, deleteMonthlyRevenue } from "@/app/actions/reports";
import { useRouter } from "next/navigation";

interface MonthlyRevenue {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
}

interface ReportsClientProps {
  monthlyRevenues: MonthlyRevenue[];
}

const TIME_ALLOCATION = [
  { category: "Design", hours: 320, color: "#8b5cf6" },
  { category: "Development", hours: 540, color: "#3b82f6" },
  { category: "Marketing", hours: 180, color: "#f59e0b" },
  { category: "QA", hours: 200, color: "#10b981" },
];

function formatMonth(ym: string) {
  const [year, month] = ym.split("-");
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-xl text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsClient({ monthlyRevenues: initial }: ReportsClientProps) {
  const router = useRouter();
  const revenues = initial;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<MonthlyRevenue | null>(null);
  const [formMonth, setFormMonth] = useState("");
  const [formRevenue, setFormRevenue] = useState("");
  const [formExpenses, setFormExpenses] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const chartData = revenues.map((r) => ({
    month: formatMonth(r.month),
    Revenue: r.revenue,
    Expenses: r.expenses,
    Profit: r.revenue - r.expenses,
  }));

  const totalRevenue = revenues.reduce((s, r) => s + r.revenue, 0);
  const totalExpenses = revenues.reduce((s, r) => s + r.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const latestRecord = revenues[revenues.length - 1];
  const prevRecord = revenues.length > 1 ? revenues[revenues.length - 2] : null;
  const revenueDiff =
    latestRecord && prevRecord
      ? (((latestRecord.revenue - prevRecord.revenue) / prevRecord.revenue) * 100).toFixed(1)
      : null;

  const openAdd = () => {
    setEditRecord(null);
    setFormMonth("");
    setFormRevenue("");
    setFormExpenses("");
    setDialogOpen(true);
  };

  const openEdit = (rec: MonthlyRevenue) => {
    setEditRecord(rec);
    setFormMonth(rec.month);
    setFormRevenue(rec.revenue.toString());
    setFormExpenses(rec.expenses.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formMonth || !formRevenue) return;
    setSaving(true);
    try {
      await saveMonthlyRevenue(
        formMonth,
        parseFloat(formRevenue),
        parseFloat(formExpenses || "0"),
        editRecord?.id
      );
      router.refresh();
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this monthly record?")) return;
    setDeletingId(id);
    try {
      await deleteMonthlyRevenue(id);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Month", "Revenue ($)", "Expenses ($)", "Net Profit ($)"];
    const rows = revenues.map((r) => [
      r.month,
      r.revenue,
      r.expenses,
      (r.revenue - r.expenses).toFixed(2),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights and financial metrics across your business.</p>
        </div>
        <Button className="gap-2" onClick={handleExportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            {revenueDiff && (
              <p className={`text-xs mt-4 flex items-center gap-1 ${parseFloat(revenueDiff) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                <TrendingUp className="h-3 w-3" />
                {revenueDiff}% vs last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <h3 className="text-2xl font-bold mt-1">${totalExpenses.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-rose-100 dark:bg-rose-950/50 rounded-full">
                <BarChart3 className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {((totalExpenses / totalRevenue) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <h3 className="text-2xl font-bold mt-1">${totalProfit.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 rounded-full">
                <PieChart className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-xs text-emerald-500 mt-4">
              {((totalProfit / totalRevenue) * 100).toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Months Tracked</p>
                <h3 className="text-2xl font-bold mt-1">{revenues.length}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <LineChartIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {revenues.length > 0 ? `Since ${formatMonth(revenues[0].month)}` : "No data yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Area Chart - Revenue & Expenses trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue & Expenses</CardTitle>
            <CardDescription>Revenue, expenses, and profit trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" fill="url(#gradRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="Expenses" stroke="#ef4444" fill="url(#gradExpenses)" strokeWidth={2} />
                <Area type="monotone" dataKey="Profit" stroke="#10b981" fill="url(#gradProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Time allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Time Allocation</CardTitle>
            <CardDescription>Hours spent by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={TIME_ALLOCATION} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v: any) => [`${v}h`, "Hours"]}
                  contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                />
                <Bar dataKey="hours" name="Hours">
                  {TIME_ALLOCATION.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget variance */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Per-month breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenues.slice(-5).map((r) => {
                const pct = Math.round((r.expenses / r.revenue) * 100);
                return (
                  <div key={r.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{formatMonth(r.month)}</span>
                      <span className="text-muted-foreground">{pct}% costs</span>
                    </div>
                    <Progress
                      value={pct}
                      className={`h-2 ${pct >= 90 ? "[&>div]:bg-rose-500" : pct >= 75 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Records</CardTitle>
              <CardDescription>Add, edit, or delete monthly revenue and expense records.</CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Month</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Expenses</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Net Profit</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Margin</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {revenues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted-foreground py-8">
                      No records yet. Add your first monthly record.
                    </td>
                  </tr>
                ) : (
                  revenues
                    .slice()
                    .reverse()
                    .map((r) => {
                      const profit = r.revenue - r.expenses;
                      const margin = ((profit / r.revenue) * 100).toFixed(1);
                      return (
                        <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-medium">{formatMonth(r.month)}</td>
                          <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                            ${r.revenue.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-rose-500 font-medium">
                            ${r.expenses.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-semibold">
                            ${profit.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <Badge
                              variant="outline"
                              className={
                                parseFloat(margin) >= 40
                                  ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30"
                                  : parseFloat(margin) >= 20
                                  ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30"
                                  : "text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30"
                              }
                            >
                              {margin}%
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(r.id)}
                                disabled={deletingId === r.id}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editRecord ? "Edit Monthly Record" : "Add Monthly Record"}</DialogTitle>
            <DialogDescription>
              {editRecord ? "Update revenue and expense figures for this month." : "Enter monthly revenue and expense data."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month (YYYY-MM)</Label>
              <Input
                id="month"
                type="month"
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 35000"
                value={formRevenue}
                onChange={(e) => setFormRevenue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses">Expenses ($)</Label>
              <Input
                id="expenses"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 12000"
                value={formExpenses}
                onChange={(e) => setFormExpenses(e.target.value)}
              />
            </div>
            {formRevenue && formExpenses && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Profit</span>
                  <span className="font-semibold text-emerald-600">
                    ${(parseFloat(formRevenue || "0") - parseFloat(formExpenses || "0")).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin</span>
                  <span className="font-semibold">
                    {(((parseFloat(formRevenue || "1") - parseFloat(formExpenses || "0")) / parseFloat(formRevenue || "1")) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !formMonth || !formRevenue}>
              {saving ? "Saving..." : editRecord ? "Save Changes" : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
