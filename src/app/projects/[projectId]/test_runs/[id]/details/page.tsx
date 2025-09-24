"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import NavigationMenu from "../../../components/NavigationMenu";
import { use } from "react";
import { useFetch } from "@/app/hooks/useFetch";

export default function TestRunDetails({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const projectId = parseInt(use(params).projectId);
  const id = parseInt(use(params).id);

  const { data: testPlans, isLoading: isTestPlansLoading } = useFetch(
    `projects/${projectId}/test_runs/${id}`
  );

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className="ml-[0px] max-w-full w-full max-h-[100%] relative flex"
    >
      <div className="w-full h-full px-[30px] pb-[20px] relative overflow-y-auto">
        <div className="flex items-center gap-[4px] w-full justify-between sticky top-[0px] bg-white z-[11] h-[80px]">
          <p className="text-2xl font-medium text-textPrimary">
            {testPlans?.name}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
