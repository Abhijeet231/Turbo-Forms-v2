import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Form } from "@/schemas/form.schema";

interface FormCardProps {
  form: Form;
}

const FormCard = ({ form }: FormCardProps) => {
  const formattedDate = new Date(form.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/dashboard/forms/${form.id}/edit`}>
      <Card className="h-44 flex flex-col justify-between bg-zinc-900 border-white/10 hover:border-white/20 transition-colors p-4">
        <CardHeader className="p-0 flex flex-row items-start justify-between space-y-0">
          <h3 className="text-base font-semibold text-white line-clamp-1">
            {form.title}
          </h3>
          <Badge variant={form.is_published ? "default" : "secondary"}>
            {form.is_published ? "Live" : "Draft"}
          </Badge>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-400 line-clamp-2">
            {form.description || "No description provided"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Created {formattedDate}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FormCard;