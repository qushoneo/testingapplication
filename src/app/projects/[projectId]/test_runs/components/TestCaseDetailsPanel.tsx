"use client";

import Icon from "@/components/Icon";
import StatusComponent from "@/components/StatusComponent";
import { SeverityColor } from "@/components/SeverityColor";
import UserAvatar from "@/components/UserAvatar";
import { TestCaseRun } from "@/types/TestCaseRun";
import { Status } from "@/types/Status";
import { Folder } from "@/types/Folder";
import { TestRun } from "@/types/TestRun";
import { User } from "@/types/User";
import { formatTime } from "@/app/lib/FormatTime";
import Button from "@/components/Button";
import { severities } from "@/app/lib/severities";
import testRunsRequest from "@/app/requests/testRuns";
import { useSelectedTestCaseRun } from "@/stores/useSelectedTestRun";
import { mutate } from "swr";

const statusButtons = [
  {
    status: "passed",
  },
  {
    status: "failed",
  },
  {
    status: "skipped",
  },
];

type TestCaseDetailsPanelProps = {
  onClose: () => void;
  testRun: TestRun;
  folders: Folder[];
  users: User[];
};

export default function TestCaseDetailsPanel({
  onClose,
  testRun,
  folders,
  users,
}: TestCaseDetailsPanelProps) {
  const { selectedTestCaseRun, setSelectedTestCaseRun } =
    useSelectedTestCaseRun();

  if (!selectedTestCaseRun) {
    return null;
  }

  const getFolderName = (folderId: number): string => {
    const folder = folders?.find((f) => f.id === folderId);
    return folder?.name || "No folder";
  };

  const getUser = (userId: number): User | undefined => {
    return users?.find((u) => u.id === userId);
  };

  const updateStatus = async (status: Status) => {
    const response = await testRunsRequest.updateTestCaseRunStatus(
      testRun.projectId,
      selectedTestCaseRun.id,
      status as Status
    );
    await mutate(
      `/api/projects/${testRun.projectId}/test_runs/${testRun.id}`,
      (currentData: TestRun | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          testCaseRuns: currentData.testCaseRuns.map((tcr: TestCaseRun) =>
            tcr.id === selectedTestCaseRun.id ? response : tcr
          ),
        };
      },
      false // не делать revalidation - только обновить кэш локально
    );

    setSelectedTestCaseRun(response as TestCaseRun);
  };

  return (
    <div className="w-[500px] bg-white border-l border-gray h-full overflow-y-auto">
      <div className="pt-[20px] pr-[0px] pl-[30px]">
        <div className="flex items-center justify-between mb-[24px]">
          <div className="flex  gap-[12px]">
            <div className="flex flex-col">
              <p className="text-[18px] font-medium text-textPrimary">
                {selectedTestCaseRun.testCase.name}
              </p>
              <p className="text-[12px] text-textPrimary opacity-50">
                {getFolderName(selectedTestCaseRun.testCase.folderId)}
              </p>
            </div>
            <div>
              <StatusComponent status={selectedTestCaseRun.status as Status} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="cross" size={24} />
          </button>
        </div>

        <div className="space-y-[16px]">
          <div className="flex items-center gap-[8px]">
            {selectedTestCaseRun.status === "untested" ? (
              statusButtons.map((button) => (
                <StatusComponent
                  onClick={() => updateStatus(button.status as Status)}
                  key={button.status}
                  status={button.status as Status}
                />
              ))
            ) : (
              <Button
                label="Run again"
                icon="repeat"
                variant="gray"
                className="w-[104px] text-[14px] px-[8px] h-[33px]"
                iconSize={16}
                onClick={() => updateStatus("untested" as Status)}
              />
            )}
          </div>

          <div>
            <p className="text-[14px] text-textPrimary opacity-50">Severity</p>
            <div className="flex items-center gap-[4px]">
              <SeverityColor value={selectedTestCaseRun.testCase.severity} />
              <p className="text-[14px] text-textPrimary">
                {selectedTestCaseRun.testCase.severity
                  ? severities.find(
                      (severity) =>
                        severity.id === selectedTestCaseRun.testCase.severity
                    )?.name
                  : "Not set"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[14px] text-textPrimary opacity-50">
              Description
            </p>
            <p className="text-[14px] text-textPrimary">
              {selectedTestCaseRun.testCase.description || "No description"}
            </p>
          </div>

          <div className="w-full bg-gray h-[1px]"></div>
          <div className="flex ">
            <div className="w-1/2">
              <p className="text-[14px] text-textPrimary opacity-50">
                Duration
              </p>
              <p className="text-[14px] text-textPrimary">
                {formatTime(testRun?.duration || 0)}
              </p>
            </div>

            <div className="w-1/2">
              <p className="text-[14px] text-textPrimary opacity-50">Author</p>
              {(() => {
                const author = testRun?.userId
                  ? getUser(testRun.userId)
                  : undefined;
                return author ? (
                  <div className="flex items-center gap-[8px]">
                    <UserAvatar user={author} />
                    <p className="text-[14px] text-textPrimary">
                      {author.name}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          <div className="flex">
            <div className="w-1/2">
              <p className="text-[14px] text-textPrimary opacity-50">
                Start Time
              </p>
              <p className="text-[14px] text-textPrimary">
                {new Date(selectedTestCaseRun.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="w-1/2">
              <p className="text-[14px] text-textPrimary opacity-50">
                End Time
              </p>
              <p className="text-[14px] text-textPrimary">
                {selectedTestCaseRun.updatedAt
                  ? new Date(selectedTestCaseRun.updatedAt).toLocaleString()
                  : "Not finished"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
