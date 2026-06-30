import Sidebar from "@/components/dashboard/Sidebar";
import EmptyState from "@/components/dashboard/EmptyState";
import FormGrid from "@/components/dashboard/FormGrid";
import PageHeader from "@/components/dashboard/PageHeader";

import { useDeleteForm } from "@/hooks/form/useDeleteForm";
import { useGetFormsById } from "@/hooks/form/useGetFormById";
import { useGetForms } from "@/hooks/form/useGetForms";
import { useUpdateForm } from "@/hooks/form/useUpdateForm";

import CreateFormModal from "@/components/dashboard/CreateFormModal";

import { useEffect, useState } from "react";

const Dashboard = () => {
  const {
    data: forms,
    count,
    isLoading: isFormsLoading,
    refetch,
  } = useGetForms();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <PageHeader />

        <main className="flex-1 p-6">
          <h2>Create Your Customize Form Here</h2>
          {/* FormGrid or EmptyState goes here depending on whether forms exist */}
          <button onClick={() => setIsCreateModalOpen(true)}>
            Create Form
          </button>

          <CreateFormModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />

          {isFormsLoading ? (
            <p className="text-gray-400">Loading...</p>
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
