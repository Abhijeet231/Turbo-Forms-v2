import { FileText, Inbox, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSubmissionCounts } from "@/hooks/form-submission/useSubmissionCounts";
import type { Form } from "@/schemas/form.schema";

const DashboardStats = ({
  forms,
  isLoading,
}: {
  forms: Form[];
  isLoading: boolean;
}) => {
  const { total: totalSubmissions, isLoading: countsLoading } = useSubmissionCounts(forms);
  const publishedForms = forms.filter((f) => f.is_published).length;

  const stats = [
    { label: "Total Forms", value: forms.length, icon: FileText, loading: isLoading },
    {
      label: "Total Submissions",
      value: totalSubmissions,
      icon: Inbox,
      loading: isLoading || countsLoading,
    },
    { label: "Published Forms", value: publishedForms, icon: CheckCircle2, loading: isLoading },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, loading }) => (
        <Card key={label} className="bg-zinc-900 border-white/10 p-4">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-2xl font-semibold text-white mt-1">
                {loading ? "…" : value.toLocaleString()}
              </p>
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