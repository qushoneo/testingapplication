'use client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Auth = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState<string>('pavelgrinevitsch2018@gmail.com');
  const [password, setPassword] = useState<string>('maps17171$');
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
              onChange={(e) => setEmail(e.target.value)}
              label='Email'
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              errors={errors}
              fieldName='password'
            />
          </div>
        </div>

        <Link href='/forgot_password'>
          <p className='text-link text-xs underline'>Forgot your password?</p>
        </Link>

        <div className='mt-auto'>
          <Button label='Log in' onClick={loginButtonClickHandler} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
