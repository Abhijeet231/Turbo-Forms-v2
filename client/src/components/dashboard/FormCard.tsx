import { Link, useNavigate } from "react-router-dom";
import { Inbox } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Form } from "@/schemas/form.schema";

interface FormCardProps {
  form: Form;
}

const FormCard = ({ form }: FormCardProps) => {
  const navigate = useNavigate();

  const formattedDate = new Date(form.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    // Card body navigates to the editor; the Responses link stops propagation
    // so it isn't swallowed by the card click (avoids nesting anchors).
    <Card
      onClick={() => navigate(`/dashboard/forms/${form.id}/edit`)}
      className="h-44 flex flex-col justify-between bg-zinc-900 border-white/10 hover:border-white/20 transition-colors p-4 cursor-pointer"
    >
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

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">Created {formattedDate}</p>
          <Link
            to={`/dashboard/forms/${form.id}/responses`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-white"
          >
            <Inbox className="h-3.5 w-3.5" />
            Responses
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormCard;
