"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupResponse {
  token: string;
}

const Auth = () => {
  const [name, setName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const loginButtonClickHandler = async () => {
    await axios
      .post<SignupResponse>("/api/signup", {
        name,
        password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="w-[100%] h-[100%] bg-gray flex justify-center items-center ">
      <div className="w-[400px] h-[420px] bg-white rounded-[4px] px-[40px] py-[20px] flex flex-col">
        <div className="w-[100%] ">
          <p className="text-black font-inter text-[24px] text-center">
            Sign up
          </p>

          <div className="flex justify-center">
            <p className="text=[14px] text-textPrimary">Don't have account? </p>
            <Link href="/login">
              <p className="text-link underline text=[14px] ml-[4px]">
                {" "}
                Full name
              </p>
            </Link>
          </div>
        </div>

        <div className="w-[100%]">
          <div className="w-[100%] mt-[40px]">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />
          </div>

          <div className="w-[100%] mt-[10px]">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
            />
          </div>
        </div>

        <div className="mt-auto">
          <Button label="Log in" onClick={loginButtonClickHandler} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
