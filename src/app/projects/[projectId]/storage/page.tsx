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
import folderRequests from "@/app/requests/folders";
import projectsRequest from "@/app/requests/projects";

export default function ProjectStorage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    setSelectedProject,
    setTestCases,
    selectedProject,
    setProjectFolders,
  } = useSelectedProjectStore();

  const [leftBarExpanded, setLeftBarExpanded] = useState<boolean>(true);

  const projectId = parseInt(React.use(params).projectId);

  useEffect(() => {
    Promise.all([
      projectsRequest.getProjectById(projectId),
      folderRequests.getFoldersByProjectId(projectId),
      testCasesRequest.getAllTestCases(projectId),
    ])
      .then((response) => {
        setSelectedProject(response[0].data);
        setProjectFolders(response[1].data);
        setTestCases(response[2].data);
      })
      .then(() => setIsLoading(false))
      .catch((e) => router.push("/projects"));
  }, [projectId]);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className="ml-[0px] max-w-full w-full justify-end !overflow-hidden max-h-[100%]"
    >
      {isLoading ? (
        <p>loading</p>
      ) : (
        <div className="max-w-[calc(100%-140px)] flex max-h-[100%] w-full ">
          <LeftSide isOpen={leftBarExpanded} setIsOpen={setLeftBarExpanded} />

          <RightSide isLeftBarOpened={leftBarExpanded} />
        </div>
      )}
    </ProtectedRoute>
  );
}
