"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Project } from "@/types/Project";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NavigationMenu from "../components/NavigationMenu";
import LeftSide from "../components/LeftSide";
import RightSide from "../components/RightSide";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";
import testCasesRequest from "@/app/requests/testCases";

export default function ProjectStorage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { setSelectedProject, setTestCases } = useSelectedProjectStore();

  const [leftBarExpanded, setLeftBarExpanded] = useState<boolean>(true);

  const projectId = React.use(params).projectId;

  useEffect(() => {
    axios
      .get(`/api/projects/${projectId}`)
      .then((response) => {
        setSelectedProject(response.data);
      })
      .catch((e) => router.push("/projects"))
      .finally(() => setIsLoading(false));

    testCasesRequest.getAllTestCases(projectId).then((response) => {
      setTestCases(response.data);
    });
  }, []);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className="ml-[0px] max-w-full w-full"
    >
      <div className="max-w-[calc(100%-140px)] flex relative left-[140px]">
        <LeftSide isOpen={leftBarExpanded} setIsOpen={setLeftBarExpanded} />

        <RightSide isLeftBarOpened={leftBarExpanded} />
      </div>
    </ProtectedRoute>
  );
}
