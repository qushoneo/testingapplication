"use client";

import { useState } from "react";
import { TestCase } from "@prisma/client";
import Icon from "@/components/Icon";
import { SeverityColor } from "@/components/SeverityColor";
import StatusComponent from "@/components/StatusComponent";
import { Folder } from "@/types/Folder";
import { TestCaseRun } from "@/types/TestCaseRun";

type TestRunFolderProps = {
  folder: Folder;
  mode?: "select" | "create" | "show";
  search?: string;
  testCaseRuns: TestCaseRun[];
  disableChildrenFolders?: boolean;
  folders: Folder[];
  showEmptyFolder?: boolean;
  onTestCaseClick?: (testCaseRun: TestCaseRun) => void;
};

export default function TestRunFolder({
  folder,
  mode = "show",
  search,
  testCaseRuns,
  disableChildrenFolders = false,
  folders,
  showEmptyFolder = false,
  onTestCaseClick,
}: TestRunFolderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const testCases: TestCase[] = testCaseRuns.map(
    (testCaseRun) => testCaseRun.testCase
  );

  const childrenFolders =
    folders?.filter(
      ({ parentId }: { parentId: number | null }) => parentId === folder.id
    ) || [];

  const childrenTestCases = testCases?.filter(
    ({ folderId, name }: { folderId: number; name: string }) =>
      folderId === folder.id &&
      (search ? name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  const getTestCaseRunStatus = (testCaseId: number) => {
    const testCaseRun = testCaseRuns.find(
      (tcr) => tcr.testCaseId === testCaseId
    );
    return testCaseRun?.status || "untested";
  };

  const hasContent = childrenFolders.length > 0 || childrenTestCases.length > 0;

  return (
    <div className={`flex flex-col relative`}>
      <div
        className={`p-[8px] pr-[24px] bg-lightgray rounded-[4px] ${
          isExpanded ? "mb-[12px]" : ""
        } gap-[12px] flex items-center `}
      >
        <div className="h-[24px] flex items-center">
          {hasContent && (
            <div
              className="border border-gray rounded-[4px] cursor-pointer p-[2px]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon
                name={isExpanded ? "black_minus" : "black_plus"}
                size={14}
              />
            </div>
          )}
        </div>

        <p className="text-[18px] font-medium h-[24px] -mt-[4px]">
          {folder.name}
        </p>

        <p className="text-[14px] text-gray-500 ml-auto">
          {childrenTestCases.length} test cases
        </p>
      </div>

      {isExpanded && (
        <div className="ml-[18px] border-l border-gray">
          <div
            className={`${
              disableChildrenFolders ? "pl-[0px]" : "pl-[18px]"
            } flex flex-col gap-[4px]`}
          >
            {childrenTestCases.length > 0 && (
              <>
                {childrenTestCases.map((testCase: TestCase, index: number) => {
                  const status = getTestCaseRunStatus(testCase.id);
                  const isLast = index === childrenTestCases.length - 1;
                  const testCaseRun = testCaseRuns.find(
                    (tcr) => tcr.testCaseId === testCase.id
                  );

                  return (
                    <div
                      key={testCase.id}
                      className={`pl-[10px] group items-center flex max-w-full relative h-[28px] cursor-pointer hover:bg-gray-50 ${
                        isLast ? "mb-[8px]" : ""
                      }`}
                      onClick={() =>
                        onTestCaseClick &&
                        testCaseRun &&
                        onTestCaseClick(testCaseRun)
                      }
                    >
                      <div className="flex gap-[12px] overflow-hidden items-center w-full">
                        <SeverityColor value={testCase.severity} />

                        <p className="text-[14px] min-w-[170px] whitespace-nowrap ">
                          {testCase.name}
                        </p>

                        <StatusComponent status={status} />

                        <p className="text-[14px] flex-grow whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                          {testCase.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {!disableChildrenFolders &&
              [...childrenFolders]
                .sort(
                  (a: Folder, b: Folder) =>
                    (a.children?.length || 0) - (b.children?.length || 0)
                )
                .filter(
                  (childFolder: Folder) =>
                    (childFolder.children?.length || 0) > 0 ||
                    testCases?.find(
                      (testCase: TestCase) =>
                        testCase.folderId === childFolder.id
                    ) ||
                    showEmptyFolder
                )
                .map((childFolder: Folder) => (
                  <TestRunFolder
                    key={childFolder.id}
                    folder={childFolder}
                    mode={mode}
                    search={search}
                    testCaseRuns={testCaseRuns}
                    disableChildrenFolders={disableChildrenFolders}
                    folders={folders}
                    showEmptyFolder={showEmptyFolder}
                    onTestCaseClick={onTestCaseClick}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
