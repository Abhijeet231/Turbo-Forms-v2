import EmptyState from "@/components/dashboard/EmptyState";
import FormGrid from "@/components/dashboard/FormGrid";
import PageHeader from "@/components/dashboard/PageHeader";

import { useGetForms } from "@/hooks/form/useGetForms";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CreateFormModal from "@/components/dashboard/CreateFormModal";
import { SkeletonCardGrid } from "@/components/skeleton/CardSkeleton";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const Dashboard = () => {
  const { data: forms, isLoading: isFormsLoading } = useGetForms();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <PageHeader />

        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            Create Your Customized Form Here
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Manage and monitor your active data collection structures.
          </p>

          <DashboardStats forms={forms} isLoading={isFormsLoading} />

          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Form
            </Button>
          </div>

          <CreateFormModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />

          {isFormsLoading ? (
           <SkeletonCardGrid/>
          ) : forms.length > 0 ? (
            <FormGrid forms={forms} />
          ) : (
            <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
