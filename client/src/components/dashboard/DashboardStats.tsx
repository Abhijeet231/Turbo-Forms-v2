import { FileText, Inbox, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Replace with real data once you wire up a stats hook
const dummyStats = {
  totalForms: 12,
  totalSubmissions: 3482,
  publishedForms: 8,
};

const DashboardStats = () => {
  const stats = [
    {
      label: "Total Forms",
      value: dummyStats.totalForms,
      icon: FileText,
    },
    {
      label: "Total Submissions",
      value: dummyStats.totalSubmissions.toLocaleString(),
      icon: Inbox,
    },
    {
      label: "Published Forms",
      value: dummyStats.publishedForms,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="bg-zinc-900 border-white/10 p-4">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-2xl font-semibold text-white mt-1">{value}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;