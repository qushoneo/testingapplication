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

export default function ProjectStorage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { setSelectedProject } = useSelectedProjectStore();

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
  }, []);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className="ml-[0px]"
    >
      <div className="w-full flex">
        <LeftSide isOpen={leftBarExpanded} setIsOpen={setLeftBarExpanded} />

        <RightSide isLeftBarOpened={leftBarExpanded} />
      </div>
    </ProtectedRoute>
  );
}
