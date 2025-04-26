'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import React, { use, useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { useModalStore } from '@/stores/useModalStore';
import CreateTestPlanModal from './components/modals/CreateTestPlanModal';
import { useFetch } from '@/app/hooks/useFetch';
import Table from '@/components/Table';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import testPlansRequest from '@/app/requests/testPlans';
import Image from 'next/image';
import NoProjects from '@/app/assets/no_projects.svg';
import EditTestPlanModal from './components/modals/EditTestPlanModal';
import { TestPlan } from '@/types/TestPlan';
import TestPlanRecovery from './components/recovery/TestPlanRecovery';

export default function TestPlansPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const {
    isCreateTestPlanOpen,
    openCreateTestPlan,
    openEditTestPlan,
    isEditTestPlanOpen,
    isCreateTestRunOpen,
  } = useModalStore();

  const { setSelectedProject } = useProjectStorageStore();

  const projectId = parseInt(use(params).projectId);
  const [selectedTestPlans, setSelectedTestPlans] = useState<TestPlan[]>([]);

  const [openedTestPlan, setOpenedTestPlan] = useState<TestPlan | null>(null);

  const { data: project, isLoading: isProjectLoading } = useFetch(
    `projects/${projectId}`
  );

  const { data: testPlans, isLoading: isTestPlanLoading } = useFetch(
    `projects/${projectId}/test_plans`
  );

  const deleteTestPlans = (testPlans: TestPlan[]) => {
    testPlansRequest.deleteTestPlan(
      testPlans.map((tp) => tp.id),
      projectId
    );
  };

  const selectTestPlan = (testPlan: TestPlan) => {
    setSelectedTestPlans([...selectedTestPlans, testPlan]);
  };

  const unselectTestPlan = (testPlan: TestPlan) => {
    setSelectedTestPlans(
      selectedTestPlans.filter((tp: TestPlan) => tp.id !== testPlan.id)
    );
  };

  const isTestPlanSelected = (testPlan: TestPlan) => {
    return selectedTestPlans.some((tp) => tp.id === testPlan.id);
  };

  const openTestPlanRecovery = (testPlan: TestPlan) => {
    setOpenedTestPlan(testPlan);
  };

  const closeTestPlanRecovery = () => {
    setOpenedTestPlan(null);
  };

  useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
  }, [project]);

  const fields = [
    { value: 'name', name: 'Plan Name', width: 'w-[15%] min-w-[230px]' },
    { value: 'test_cases', name: 'Test cases', width: 'w-[15%] min-w-[210px]' },
    { value: 'description', name: 'Description', width: 'w-[70%] flex-1' },
  ];

  if (openedTestPlan) {
    return (
      <TestPlanRecovery
        testPlan={openedTestPlan}
        closeRecovery={closeTestPlanRecovery}
      />
    );
  }

  if (isTestPlanLoading || isProjectLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className='ml-[0px] max-w-full w-full max-h-[100%] relative flex'
    >
      {isTestPlanLoading ? (
        <Loading offset={{ left: 140 }} />
      ) : (
        <div className='w-full h-full px-[30px] pb-[20px] relative overflow-y-auto'>
          <div className='flex items-center gap-[4px] w-full justify-between sticky top-[0px] bg-white z-[11] h-[80px]'>
            <div className='flex items-center gap-[4px]'>
              <p
                className={`whitespace-nowrap ellipsis text-ellipsi font-medium text-[24px]`}
              >
                Test Plans
              </p>

              <div
                className={`p-[2px] rounded-[4px] border border-gray min-w-[24px] flex items-center justify-center ml-[4px]`}
              >
                <p className='text-[12px] '>{testPlans?.length}</p>
              </div>

              {selectedTestPlans.length > 0 && (
                <div className='flex items-center gap-[24px] px-[20px] w-full'>
                  {selectedTestPlans.length === 1 && (
                    <Button
                      label='Edit'
                      icon='pencil'
                      variant='gray'
                      className='w-[94px]'
                      iconSize={24}
                      onClick={() => {
                        openEditTestPlan(selectedTestPlans[0].id);
                      }}
                    />
                  )}

                  <Button
                    label='Delete'
                    icon='trash'
                    variant='gray'
                    iconSize={24}
                    className='w-[114px]'
                    onClick={() => {
                      deleteTestPlans(selectedTestPlans);
                    }}
                  />

                  <p className='text-textPrimary text-[14px] flex whitespace-nowrap'>
                    Selected: {selectedTestPlans.length}{' '}
                    {selectedTestPlans.length === 1
                      ? 'test plan'
                      : 'test plans'}
                  </p>
                </div>
              )}
            </div>

            <div className='flex items-center gap-[24px] max-h-[100%]'>
              <Button
                onClick={openCreateTestPlan}
                className='min-w-fit w-[150px] ml-[auto]'
                label='Create plan'
                icon='white_plus'
                iconSize={24}
              />
            </div>
          </div>

          {testPlans.length > 0 ? (
            <>
              <div className='z-10 sticky top-[80px] bg-white'>
                <div className='bg-lightgray h-[30px] w-full rounded-[4px] pr-[24px] pl-[32px] flex items-center gap-[12px] z-9'>
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

              <div className='w-full h-full flex flex-col z-[10]'>
                <Table
                  sortField='name'
                  className='z-[9]'
                  data={testPlans}
                  fields={fields}
                  onSelect={selectTestPlan}
                  onUnselect={unselectTestPlan}
                  onRowClick={openTestPlanRecovery}
                  isSelected={isTestPlanSelected}
                  renderCell={(
                    testPlan: TestPlan,
                    fieldValue: string,
                    fieldWidth: string
                  ): React.ReactNode => {
                    return (
                      <>
                        {fieldValue === 'name' && (
                          <p
                            key={testPlan.id}
                            className={`text-sm text-textPrimary ${fieldWidth} overflow-hidden text-ellipsis whitespace-nowrap`}
                          >
                            {testPlan.name}
                          </p>
                        )}
                        {fieldValue === 'test_cases' && (
                          <p
                            className={`text-sm text-link underline ${fieldWidth} overflow-hidden text-ellipsis whitespace-nowrap`}
                          >
                            {testPlan.testCases.length} test cases
                          </p>
                        )}

                        {fieldValue === 'description' && (
                          <p
                            className={`text-sm text-textPrimary ${fieldWidth} overflow-hidden text-ellipsis whitespace-nowrap`}
                          >
                            {testPlan.description}
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>
            </>
          ) : (
            <div className='flex justify-center items-center pt-[65px] flex-col gap-[16px]'>
              <Image src={NoProjects} alt='No Projects' />

              <p className='text-textPrimary text-[18px] font-medium'>
                You don't have any test plans yet
              </p>

              <Button
                label={'Create Test Plan'}
                icon='white_plus'
                iconSize={24}
                onClick={openCreateTestPlan}
                className='w-[170px]'
              />
            </div>
          )}
        </div>
      )}

      {isCreateTestPlanOpen && <CreateTestPlanModal projectId={projectId} />}

      {isEditTestPlanOpen && (
        <EditTestPlanModal projectId={projectId} testPlans={testPlans} />
      )}
    </ProtectedRoute>
  );
}
