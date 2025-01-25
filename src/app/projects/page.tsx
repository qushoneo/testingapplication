"use client";

import Button from "../../components/Button";
import ProtectedRoute from "../../components/ProtectedRoute";
import Image from "next/image";
import WhitePlus from "@/app/assets/white_plus.svg";
import { useProjectsStore } from "./useProjectsStore";
import ProjectsTable from "./ProjectsTable";

const ProjectsPage = () => {
  const { projects } = useProjectsStore();

  const createProject = () => {};

  const fields = [
    { name: "Project Name", width: "w-[15%] min-w-[230px]" },
    { name: "Open defects", width: "w-[15%] min-w-[210px]" },
    { name: "Members", width: "w-[70%] flex-1" },
  ];

  return (
    <ProtectedRoute>
      <div className="w-full h-full px-[30px] pb-[20px] relative">
        <div className="flex gap-[8px] items-center sticky w-full top-[0px] pt-[20px] pb-[5px] bg-white">
          <p className="text-2xl font-medium text-textPrimary">Projects</p>
          <div>
            <p className="p-[4px] text-xs text-textPrimary rounded-[4px] h-[24px] border border-gray min-w-[24px] text-center">
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

        <div className="z-10 sticky top-[65px] pt-[20px] bg-white">
          <div className="bg-lightgray h-[30px] w-full rounded-[4px] px-[24px] ml-[8px] flex items-center gap-[12px] ">
            {fields.map((field, i) => (
              <p
                key={i}
                className={`text-lg ${field.width} text-textPrimary font-medium`}
              >
                {field.name}
              </p>
            ))}
          </div>
        </div>

        <ProjectsTable />
      </div>
    </ProtectedRoute>
  );
};

export default ProjectsPage;
