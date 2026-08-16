// dashboard/analytics
// KPI row (total/published forms, total submissions) + a per-form submission
// count chart. Counts come from useSubmissionCounts, shared with
// DashboardStats — no aggregate endpoint exists server-side, so it fans out
// one request per form.

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { BarChart2, FileText, CheckCircle2, Inbox, Loader2 } from "lucide-react";

import { useGetForms } from "@/hooks/form/useGetForms";
import { useSubmissionCounts } from "@/hooks/form-submission/useSubmissionCounts";
import type { Form } from "@/schemas/form.schema";
import { Card, CardContent } from "@/components/ui/card";

const ACCENT = "#ec4899"; // pink-500 — this app's established accent (see Submissions.tsx, FormPage)

// ── stat tile ────────────────────────────────────────────────────────────—─
const StatTile = ({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
  loading?: boolean;
}) => (
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            value.toLocaleString()
          )}
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

// ── custom tooltip: value leads (Strong), label follows (secondary) ────────
const ChartTooltip = ({ active, payload }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]!.payload as { title: string; count: number };
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-sm">
      <p className="text-sm font-semibold text-popover-foreground">
        {point.count.toLocaleString()} {point.count === 1 ? "response" : "responses"}
      </p>
      <p className="text-xs text-muted-foreground">{point.title}</p>
    </div>
  );
};

const MAX_BARS = 8;

const Analytics = () => {
  const { data: forms, isLoading: formsLoading } = useGetForms();
  const { counts, total: totalSubmissions, isLoading: countsLoading } = useSubmissionCounts(forms);

  const publishedForms = forms.filter((f: Form) => f.is_published).length;

  const chartData = useMemo(
    () =>
      forms
        .map((f: Form) => ({ title: f.title || "Untitled form", count: counts[f.id] ?? 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_BARS),
    [forms, counts]
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <BarChart2 className="h-6 w-6 text-pink-500" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your forms and the responses they've collected.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total forms" value={forms.length} icon={FileText} loading={formsLoading} />
        <StatTile
          label="Published forms"
          value={publishedForms}
          icon={CheckCircle2}
          loading={formsLoading}
        />
        <StatTile
          label="Total submissions"
          value={totalSubmissions}
          icon={Inbox}
          loading={formsLoading || countsLoading}
        />
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-4 text-sm font-medium text-foreground">
            Submissions per form
            {forms.length > MAX_BARS && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (top {MAX_BARS} of {forms.length})
              </span>
            )}
          </h2>

          {formsLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <FileText className="h-8 w-8 opacity-40" />
              <p className="text-sm">Create a form to start seeing analytics here.</p>
            </div>
          ) : (
            <div style={{ height: Math.max(chartData.length * 40, 120) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={140}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(title: string) =>
                      title.length > 18 ? `${title.slice(0, 18)}…` : title
                    }
                  />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    cursor={{ fill: "var(--muted)" }}
                  />
                  <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
