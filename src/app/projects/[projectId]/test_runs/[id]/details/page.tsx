"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import NavigationMenu from "../../../components/NavigationMenu";
import { use, useEffect, useState } from "react";
import { useFetch } from "@/app/hooks/useFetch";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import { Folder } from "@/types/Folder";
import { TestCaseRun } from "@/types/TestCaseRun";
import folderRequests from "@/app/requests/folders";
import TestRunFolder from "../../components/TestRunFolder";
import TestCaseDetailsPanel from "../../components/TestCaseDetailsPanel";
import { getTestRunFolderIds } from "@/app/lib/testRunUtils";
import Image from "next/image";
import NoProjects from "@/app/../../public/assets/no_projects.svg";

export default function TestRunDetails({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const [detailsMode, setDetailsMode] = useState<"test_cases" | "defects">(
    "test_cases"
  );

  const [selectedTestCaseRun, setSelectedTestCaseRun] =
    useState<TestCaseRun | null>(null);

  const [testRunFolders, setTestRunFolders] = useState<Folder[]>([]);
  const [isTestRunFoldersLoading, setIsTestRunFoldersLoading] = useState(false);

  const projectId = parseInt(use(params).projectId);
  const id = parseInt(use(params).id);
  const router = useRouter();

  const { data: testRun, isLoading: isTestRunLoading } = useFetch(
    `projects/${projectId}/test_runs/${id}`
  );

  const { data: users, isLoading: isUsersLoading } = useFetch("/users");

  const getRootFolders = (folders: Folder[]) => {
    return folders.filter((folder) => folder.parentId === null);
  };

  const selectTestCaseRun = (testCaseRun: TestCaseRun) => {
    setSelectedTestCaseRun(testCaseRun);
  };

  useEffect(() => {
    if (testRun) {
      setIsTestRunFoldersLoading(true);
      folderRequests
        .getFoldersByIds(getTestRunFolderIds(testRun))
        .then((folders) => {
          setTestRunFolders(folders);
          setIsTestRunFoldersLoading(false);
        });
    }
  }, [testRun]);

  //TODO: Переделать запрос

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className="ml-[0px] max-w-full w-full max-h-[100%] relative flex"
    >
      {isTestRunLoading || isTestRunFoldersLoading ? (
        <Loading offset={{ left: 140 }} />
      ) : (
        <div className="w-full h-full px-[30px] relative overflow-y-auto flex">
          <div className="flex-1 pb-[20px] pr-[20px]">
            <div className="flex items-center gap-[4px] w-full justify-between sticky top-[0px] bg-white z-[11] h-[80px]">
              <div className="flex items-center gap-[8px]">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/projects/${projectId}/test_runs`)
                  }
                >
                  <Icon name="arrow_left" size={20} />
                </div>
                <p className="text-2xl font-medium text-textPrimary">
                  {testRun.name}
                </p>
              </div>

              <div className="flex items-center gap-[24px] max-h-[100%]">
                <Button
                  className="min-w-fit w-[135px] ml-[auto]"
                  onClick={() => {}}
                  label="Complete"
                  variant="filled"
                  icon="white_check"
                  iconSize={24}
                />
              </div>
            </div>
            <div className="w-full h-[40px] bg-[lightgray] rounded-[4px]">
              <div className="w-full h-full flex items-center gap-[4px] px-[4px]">
                <div
                  className={`w-[95px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer ${
                    detailsMode === "test_cases" ? "bg-white" : "bg-[lightgray]"
                  }`}
                  onClick={() => setDetailsMode("test_cases")}
                >
                  <p className="text-textPrimary text-[14px] ">Test cases</p>
                </div>

                <div
                  className={`w-[86px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer ${
                    detailsMode === "defects" ? "bg-white" : "bg-[lightgray]"
                  }`}
                  onClick={() => setDetailsMode("defects")}
                >
                  <p className="text-textPrimary text-[14px] ">Defects</p>
                </div>
              </div>
            </div>
            {detailsMode === "test_cases" && (
              <div className="mt-[20px]">
                {testRun && testRunFolders.length > 0 ? (
                  <div className="flex flex-col gap-[4px]">
                    {getRootFolders(testRunFolders).map((folder) => (
                      <TestRunFolder
                        key={folder.id}
                        folder={folder}
                        mode="show"
                        testCaseRuns={testRun.testCaseRuns}
                        folders={testRunFolders}
                        showEmptyFolder={false}
                        onTestCaseClick={selectTestCaseRun}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full pt-[40px] flex-col gap-[16px] max-h-[calc(100%-80px)]">
                    <Image src={NoProjects} alt="No Projects" />

                    <p className="text-textPrimary text-[18px] font-medium">
                      No test cases in this test run, yet
                    </p>
                  </div>

                  //todo: move to component
                )}
              </div>
            )}
          </div>

          <TestCaseDetailsPanel
            selectedTestCaseRun={selectedTestCaseRun}
            setSelectedTestCaseRun={setSelectedTestCaseRun}
            onClose={() => setSelectedTestCaseRun(null)}
            testRun={testRun}
            folders={testRunFolders}
            users={users}
          />
        </div>
      )}
    </ProtectedRoute>
  );
}
