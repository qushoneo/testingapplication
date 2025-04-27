'use client';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { use, useEffect, useState } from 'react';
import {
  validateJobTitle,
  validatePasswordField,
  validateFullName,
} from '../../lib/validate';
import { jobTitles } from '../../lib/jobTitles';
import { JobTitle } from '@/types/JobTitle';
import { Select } from '@/components/Select';
import { useRouter } from 'next/navigation';
import { useFetch } from '@/app/hooks/useFetch';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthProvider';

export default function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = use(params).id;

  const router = useRouter();

  const { user, invitedSignup } = useAuth();

  const [name, setName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<JobTitle | null>(null);
  const [password, setPassword] = useState<string>('');

  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  useEffect(() => {
    if (user) {
      router.push('/projects');
    }
  }, [user]);

  const { data, isLoading, error } = useFetch(`/invite/${id}`);

  const validateForm = () => {
    const validationErrors: { field: string; message: string }[] = [];

    const nameError = validateFullName(name);
    if (nameError) {
      validationErrors.push({ field: 'name', message: nameError });
    }

    const passwordError = validatePasswordField(password);
    if (passwordError) {
      validationErrors.push({ field: 'password', message: 'error' });
    }

    const jobTitleError = validateJobTitle(jobTitle);
    if (jobTitleError) {
      validationErrors.push({ field: 'jobTitle', message: jobTitleError });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const finishInviteButtonClickHandler = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) return;

    setErrors([]);

    if (!jobTitle) {
      return;
    }

    invitedSignup(
      data.email,
      password,
      name,
      jobTitle?.name || '',
      data.company.id,
      data.id
    )
      .then(() => {
        router.push('/projects');
      })
      .catch((e) => {
        console.log(e);
        setErrors(e.response.data);
      });
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (error) {
    router.push('/login');
    return null;
  }

  return (
    <div className='w-[100%] h-[100%] bg-gray flex justify-center items-center '>
      <div className='w-[400px] h-[540px] bg-white rounded-[4px] px-[40px] py-[20px] flex flex-col'>
        <div className='w-[100%] '>
          <p className='text-black font-inter text-[20px] text-center'>
            You're invited to join a company
          </p>

          <p className='text-black font-inter text-[16px] text-center font-bold text-link italic text-wrap line-clamp-2'>
            {data?.company?.name || ''}
          </p>
        </div>

        <div className='w-[100%]'>
          <div className='w-[100%] mt-[40px]'>
            <Input
              value={name}
              maxLength={25}
              onChange={(e) =>
                setName(
                  e.target.value.replace(/\b\w/g, (char) => char.toUpperCase())
                )
              }
              label='Full name'
              errors={errors}
              fieldName='name'
            />
          </div>

          <div className='w-[100%] mt-[10px]'>
            <Select
              label='Job title'
              options={jobTitles}
              value={jobTitle}
              setValue={setJobTitle}
              errors={errors}
              fieldName='jobTitle'
            />
          </div>

          <div className='w-[100%] mt-[10px]'>
            <Input
              value={data.email}
              onChange={() => {}}
              label='Email'
              type='email'
              errors={errors}
              fieldName='email'
              disabled
            />
          </div>

          <div className='w-[100%] mt-[10px]'>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label='Password'
              type='password'
              showPasswordRequirements={true}
              fieldName='password'
            />
          </div>
        </div>

        <div className='mt-auto'>
          <Button
            label={'Sign up'}
            disabled={isLoading}
            onClick={finishInviteButtonClickHandler}
          />
        </div>
      </div>
    </div>
  );
}
