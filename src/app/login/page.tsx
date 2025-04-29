'use client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { validateEmail } from '../lib/validate';

const Auth = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  useEffect(() => {
    if (user) {
      router.push('/projects');
    }
  }, [user, router]);

  if (user) {
    return <></>;
  }

  const loginButtonClickHandler = async () => {
    await login(email, password)
      .then((response) => {
        router.push('/projects');
      })
      .catch((e) => {
        console.log(e.response.data);
        setErrors(e.response.data);
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      loginButtonClickHandler();
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className='w-[100%] h-[100%] bg-gray flex justify-center items-center '>
      <div className='w-[400px] h-[420px] bg-white rounded-[4px] px-[40px] py-[20px] flex flex-col'>
        <div className='w-[100%] '>
          <p className='text-black font-inter text-[24px] text-center'>
            Log in
          </p>

          <div className='flex justify-center'>
            <p className='text=[14px] text-textPrimary'>Don't have account? </p>
            <Link href='/signup'>
              <p className='text-link underline text=[14px] ml-[4px]'>
                Sign up
              </p>
            </Link>
          </div>
        </div>

        <div className='w-[100%]'>
          <div className='w-[100%] mt-[40px]'>
            <Input
              value={email}
              onChange={handleEmailChange}
              label='Email'
              onKeyDown={handleKeyDown}
              errors={errors}
              fieldName='email'
            />
          </div>

          <div className='w-[100%] mt-[10px]'>
            <Input
              value={password}
              onChange={handlePasswordChange}
              label='Password'
              type='password'
              onKeyDown={handleKeyDown}
              errors={errors}
              fieldName='password'
            />
          </div>
        </div>

        <Link
          onClick={(e) => {
            if (validateEmail(email)) {
              setErrors([{ field: 'email', message: 'Invalid email format' }]);
              e.preventDefault();
            }
          }}
          href={`/forgot_password?email=${encodeURIComponent(email)}`}
        >
          <p
            className={`text-link text-xs underline relative ${
              errors.find((err) => err.field === 'password')
                ? ''
                : 'top-[-18px]'
            }`}
          >
            Forgot your password?
          </p>
        </Link>

        <div className='mt-auto'>
          <Button label='Log in' onClick={loginButtonClickHandler} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
