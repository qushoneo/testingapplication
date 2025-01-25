import Link from "next/link";
import { useProjectsStore } from "./useProjectsStore";

export default function ProjectsTable() {
  const { projects } = useProjectsStore();

  const projecsTableFields = [
    { name: "name", width: "w-[15%] min-w-[230px]" },
    { name: "defects", width: "w-[15%] min-w-[210px]" },
    { name: "members", width: "w-[70%] flex-1" },
  ];

  return (
    <div className="mt-[12px] flex flex-col gap-[4px]">
      {projects.map((project) => {
        return (
          <div key={project.id} className="flex gap-[12px] ml-[24px] px-[8px]">
            {projecsTableFields.map((field, j) => {
              if (field.name === "name")
                return (
                  <p
                    key={"col-" + j}
                    className={`text-sm text-textPrimary ${field.width}`}
                  >
                    {project.name}
                  </p>
                );

              if (field.name === "defects") {
                return project.defects.length === 0 ? (
                  <p
                    key={"col-" + j}
                    className={`text-sm text-textPrimary ${field.width}`}
                  >
                    No defects were found
                  </p>
                ) : (
                  <Link
                    href="/defects"
                    className={`text-sm text-link underline ${field.width}`}
                    key={"col-" + j}
                  >
                    <p>Link to defects</p>
                  </Link>
                );
              }

              if (field.name === "members") {
                const displayingMembers = 3;
                const remainingMembersCount =
                  project.members.length - displayingMembers;

                return (
                  <div
                    key={"col" + j}
                    className={`${field.width} flex gap-[12px]`}
                  >
                    {project.members
                      .slice(0, displayingMembers)
                      .map((member) => (
                        <p key={member.id} className="text-sm">
                          {member.name}
                        </p>
                      ))}

                    {remainingMembersCount > 0 && (
                      <p className="text-[14px] p-[2px] leading-[16px] border border-gray min-w-[18px] rounded-[4px] flex items-center justify-center">
                        +{remainingMembersCount}
                      </p>
                    )}
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
