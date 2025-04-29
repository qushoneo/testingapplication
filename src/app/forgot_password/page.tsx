'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import Image from 'next/image';
import Arrow from '@/app/../../public/assets/arrow_down.svg';
import { useAuth } from '../../context/AuthProvider';
import { useFetch } from '../hooks/useFetch';
import usersRequest from '../requests/users';
import { validateEmail, validatePasswordField } from '../lib/validate';
import ErrorComponent from '@/components/ErrorComponent';
import Input from '@/components/Input';

const ForgotPassword = () => {
  const router = useRouter();
  const { user } = useAuth();
  const params = useSearchParams();
  const email = params.get('email');

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [errors, setErrors] = useState([]);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);

  const [newPassword, setNewPassword] = useState<string>('');

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const codeSize = Array.from({ length: 6 });

  useEffect(() => {
    if (!validateEmail(email)) {
      usersRequest.forgotPasswordInitial(email);
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/projects');
    }
  }, [user, router]);

  const toLogin = () => {
    router.push('/login');
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === 'Enter') {
      sendCode();
    }

    if (e.key === 'Backspace' && code[i] === '' && i > 0) {
      inputRefs.current[i - 1].focus();
    }

    if (e.key.match(/^\d$/) && code[i] !== '') {
      if (i < 5) inputRefs.current[i + 1].focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    setErrors([]);
    let input = e.target.value;

    input = input.replace(/[^0-9]/g, '');

    if (input.length > 1) {
      input = input[0];
    }

    setCode((prevCode) => prevCode.map((val, j) => (j === i ? input : val)));

    if (input !== '' && i < code.length - 1) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    i: number
  ) => {
    setErrors([]);
    const pastedText = e.clipboardData.getData('text');
    if (/\D/.test(pastedText)) {
      e.preventDefault();
    }
  };

  const handlePagePaste = (e) => {
    setErrors([]);
    const pastedText = e.clipboardData.getData('text');
    if (/\D/.test(pastedText)) {
      e.preventDefault();
    } else if (pastedText.length === 6) {
      setCode(pastedText.split(''));
    }
  };

  const sendCode = () => {
    usersRequest
      .sendCode(email, code.join(',').replaceAll(',', ''))
      .then(() => {
        setIsCodeValid(true);
      })
      .catch((e) => setErrors(e.response.data));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const changePassword = () => {
    usersRequest.changePassword(email, newPassword).then(() => {
      toLogin();
    });
  };

  return (
    <div
      onPaste={handlePagePaste}
      className='w-[100%] h-[100%] bg-gray flex justify-center items-center'
    >
      <div
        className={`w-[400px] ${
          isCodeValid ? 'h-[360px]' : 'h-[400px]'
        } bg-white rounded-[4px] px-[40px] pt-[20px] pb-[40px] flex flex-col`}
      >
        {isCodeValid ? (
          <>
            <div className='w-[100%] relative mb-[20px]'>
              <div className='flex w-full justify-center items-center mb-[10px]'>
                <p className='text-primary font-inter text-[24px] text-center'>
                  Change your password
                </p>
              </div>
            </div>

            <div>
              <Input
                value={newPassword}
                onChange={handlePasswordChange}
                fieldName='password'
                label='New password'
                type='password'
                showPasswordRequirements
              />
            </div>

            <div className='mt-auto'>
              <Button
                label='To login'
                disabled={validatePasswordField(newPassword)}
                onClick={changePassword}
              />
            </div>
          </>
        ) : (
          <>
            <div className='w-[100%] relative mb-[40px]'>
              <div className='flex w-full justify-center items-center mb-[10px]'>
                <Image
                  src={Arrow}
                  alt='back'
                  className='absolute left-[0px] rotate-[90deg] w-[24px] h-[24px] cursor-pointer'
                  onClick={toLogin}
                />
                <p className='text-primary font-inter text-[24px] text-center'>
                  Verify your email
                </p>
              </div>
              <div className='flex justify-center flex-col'>
                <p className='text=[16px] text-textPrimary text-center'>
                  Enter the code we've sent to
                </p>
                <p className='text-[16px] text-textPrimary text-center font-medium'>
                  {email}
                </p>
              </div>
            </div>

            <div className='flex gap-[10px] mb-[40px] relative'>
              {codeSize.map((_, i) => {
                return (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    className={`w-[40px] h-[40px] text-center border-gray border text-xl rounded-[4px] ${
                      i === 2 ? 'mr-[30px]' : ''
                    }`}
                    value={code[i]}
                    inputMode='numeric'
                    type='text'
                    maxLength={1}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={(e) => handlePaste(e, i)}
                  />
                );
              })}
              {errors.length > 0 && errors[0].field === 'code' && (
                <ErrorComponent
                  errorMessage={errors[0].message}
                  className='absolute bottom-[-18px]'
                />
              )}
            </div>

            <div className='w-full flex gap-[5px] mb-[90px]'>
              <p className='text-[12px]'>Didn't recieve the code?</p>
              <p className='underline text-link text-[12px] cursor-pointer'>
                Send again
              </p>
            </div>

            <div className='mt-auto'>
              <Button
                label='Continue'
                disabled={code.some((el) => el === '')}
                onClick={sendCode}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ForgotPasswordContainer = () => (
  <Suspense fallback={<div>loading</div>}>
    <ForgotPassword />
  </Suspense>
);

export default ForgotPasswordContainer;
