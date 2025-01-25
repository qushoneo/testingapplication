"use client";

import { useState } from "react";
import Button from "../../components/Button";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthProvider";
import Image from "next/image";
import WhitePlus from "@/app/assets/white_plus.svg";

const ProjectsPage = () => {
  const { logout } = useAuth();

  const [projects, setProjects] = useState([]);

  const createProject = () => {};

  return (
    <ProtectedRoute>
      <div className="w-full h-full px-[30px] py-[20px]">
        <div className="flex gap-[8px] items-center">
          <p className="text-2xl font-medium text-textPrimary">Projects</p>
          <div>
            <p className="p-[4px] text-xs text-textPrimary rounded-[4px] border border-gray min-w-[24px] text-center">
              {projects.length}
            </p>
          </div>

          <Button
            className="ml-auto w-[170px]"
            label={
              <div className="flex items-center gap-[8px]">
                <Image
                  className="w-[20px] h-[20px]"
                  src={WhitePlus}
                  alt="create_project"
                />
                <p className="text-white font-normal">Create Project</p>
              </div>
            }
            onClick={createProject}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectsPage;
