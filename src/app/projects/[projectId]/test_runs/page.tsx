"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import React, { use } from "react";
import NavigationMenu from "../components/NavigationMenu";
import Image from "next/image";
import NoProjects from "@/app/../../public/assets/no_projects.svg";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { useFetch } from "@/app/hooks/useFetch";
import Loading from "@/components/Loading";
import { TestRun } from "@/types/TestRun";
import StatusComponent from "@/components/StatusComponent";
import { User } from "@/types/User";
import { TestPlan } from "@/types/TestPlan";
import { formatTime } from "@/app/lib/FormatTime";
import UserAvatar from "@/components/UserAvatar";
import { useState } from "react";

export default function TestRunsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = parseInt(use(params).projectId);
  const [selectedTestRuns, setSelectedTestRuns] = useState<TestRun[]>([]);

  const { data: users, isLoading: isUsersLoading } = useFetch("/users");

  const { data: testPlans, isLoading: isTestPlansLoading } = useFetch(
    `projects/${projectId}/test_plans`
  );

  const { data: testRuns, isLoading: isTestRunLoading } = useFetch(
    `projects/${projectId}/test_runs`
  );

  const selectTestRun = (testRun: TestRun) => {
    setSelectedTestRuns([...selectedTestRuns, testRun]);
  };

  const unselectTestRun = (testRun: TestRun) => {
    setSelectedTestRuns(
      selectedTestRuns.filter((tr: TestRun) => tr.id !== testRun.id)
    );
  };

  const isTestRunSelected = (testRun: TestRun) => {
    return selectedTestRuns.some((tr) => tr.id === testRun.id);
  };

  const fields = [
    { name: "Test Run Name", width: "w-[20%] min-w-[230px]", value: "name" },
    { name: "Status", width: "w-[15%] min-w-[200px]", value: "status" },
    { name: "Author", width: "w-[15%] min-w-[160px]", value: "author" },
    { name: "Time", width: "w-[5%] min-w-[100px]", value: "duration" },
    {
      name: "Test Plan",
      width: "w-[10%] min-w-[160px] flex-1",
      value: "test_plan",
    },
    {
      name: "Test Run Statistics",
      width: "w-[35%]",
      value: "test_run_statistics",
    },
  ];

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className="ml-[0px] max-w-full w-full max-h-[100%] relative flex"
    >
      {isTestRunLoading && isUsersLoading && isTestPlansLoading ? (
        <Loading offset={{ left: 140 }} />
      ) : (
        <div className="w-full h-full px-[30px] pb-[20px] relative overflow-y-auto">
          <div className="flex items-center gap-[4px] w-fu  ll justify-between sticky top-[0px] bg-white z-[11] h-[80px]">
            <div className="flex items-center gap-[4px]">
              <p
                className={`whitespace-nowrap ellipsis text-ellipsi font-medium text-[24px]`}
              >
                Test runs
              </p>

              <div
                className={`p-[2px] rounded-[4px] border border-gray min-w-[24px] flex items-center justify-center ml-[4px]`}
              >
                <p className="text-[12px] ">{testRuns?.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-[24px] max-h-[100%]">
              <Button
                onClick={() => {}}
                className="min-w-fit w-[150px] ml-[auto]"
                label="Start run"
                icon="play"
                iconSize={24}
              />
            </div>
          </div>
          {testRuns?.length > 0 ? (
            <>
              <div className="z-10 sticky top-[80px] bg-white">
                <div className="bg-lightgray h-[30px] w-full rounded-[4px] pr-[24px] pl-[32px] flex items-center gap-[12px] z-9">
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

              <Table
                sortField="name"
                className="z-[9]"
                data={testRuns}
                fields={fields}
                onSelect={selectTestRun}
                onUnselect={unselectTestRun}
                isSelected={isTestRunSelected}
                renderCell={(testRun: TestRun, fieldValue: string) => {
                  return (
                    <>
                      {fieldValue === "name" && (
                        <p
                          key={testRun.id}
                          className={`flex items-center h-full text-sm text-textPrimary`}
                        >
                          {testRun.name}
                        </p>
                      )}
                      {fieldValue === "status" && (
                        <StatusComponent status={testRun.status} size="s" />
                      )}
                      {fieldValue === "author" &&
                        (() => {
                          const author = users?.find(
                            (user: User) => user.id === testRun.userId
                          );
                          return (
                            <div className="flex items-center h-full gap-[10px]">
                              {author && <UserAvatar user={author} />}
                              <p className="text-sm whitespace-nowrap text-textPrimary">
                                {author?.name || "Unknown User"}
                              </p>
                            </div>
                          );
                        })()}
                      {fieldValue === "duration" && (
                        <p className="flex items-center h-full text-sm">
                          {formatTime(testRun.duration || 0)}
                        </p>
                      )}

                      {fieldValue === "test_plan" && (
                        <p className="flex items-center h-full text-sm">
                          {
                            testPlans?.find(
                              (testPlan: TestPlan) =>
                                testPlan.id === testRun.testPlanId
                            )?.name
                          }
                        </p>
                      )}
                      {fieldValue === "test_run_statistics" && <p></p>}
                    </>
                  );
                }}
              />
            </>
          ) : (
            <div className="flex justify-center items-center pt-[65px] flex-col gap-[16px]">
              <Image src={NoProjects} alt="No Projects" />

              <p className="text-textPrimary text-[18px] font-medium">
                You don't have any Test runs yet
              </p>

              <Button
                label={"Start run"}
                icon="play"
                iconSize={24}
                onClick={() => {}}
                className="w-[170px]"
              />
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
