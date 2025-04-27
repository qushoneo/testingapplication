'use client';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { Select } from '../../components/Select';
import { JobTitle } from '../../types/JobTitle';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthProvider';
import { jobTitles } from '../lib/jobTitles';
import {
  validateJobTitle,
  validatePasswordField,
  validateEmail,
  validateFullName,
} from '../lib/validate';

const Signup = () => {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<JobTitle | null>(jobTitles[0]);
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  useEffect(() => {
    if (user) {
      router.push('/projects');
    }
  }, [user, router]);

  const validateForm = () => {
    const validationErrors: { field: string; message: string }[] = [];

    const emailError = validateEmail(email);
    if (emailError) {
      validationErrors.push({ field: 'email', message: emailError });
    }

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

  const signupButtonClickHandler = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) return;

    setLoading(true);
    setErrors([]);

    if (!jobTitle) {
      return;
    }

    signup(email, password, name, jobTitle.name)
      .then(() => {
        router.push('/projects');
      })
      .catch((e) => {
        setErrors(e.response.data);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='w-[100%] h-[100%] bg-gray flex justify-center items-center '>
      <div className='w-[400px] h-[540px] bg-white rounded-[4px] px-[40px] py-[20px] flex flex-col'>
        <div className='w-[100%] '>
          <p className='text-black font-inter text-[24px] text-center'>
            Sign up
          </p>

          <div className='flex justify-center'>
            <p className='text-sm text-textPrimary'>Already have an account?</p>
            <Link href='/login'>
              <p className='text-link underline text-sm ml-[4px]'>Log in</p>
            </Link>
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label='Email'
              type='email'
              errors={errors}
              fieldName='email'
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
            disabled={loading}
            onClick={signupButtonClickHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
