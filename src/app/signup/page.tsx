"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Select } from "@/components/Select";
import { jobTitles } from "@/lib/constants";
import { JobTitle } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

interface SignupResponse {
  token: string;
}

const Auth = () => {
  // const [name, setName] = useState<string>("");
  // const [jobTitle, setJobTitle] = useState<JobTitle | null>(null);
  // const [password, setPassword] = useState<string>("");
  // const [email, setEmail] = useState<string>("");

  const [name, setName] = useState<string>("pavel");
  const [jobTitle, setJobTitle] = useState<JobTitle | null>(jobTitles[1]);
  const [password, setPassword] = useState<string>("maps17171");
  const [email, setEmail] = useState<string>("pavelgrinevitsch2018@gmail.com");

  const loginButtonClickHandler = async () => {
    if (!name || !password || !email || !jobTitle) {
      return;
    }

    try {
      const response = await axios.post<SignupResponse>("/api/signup", {
        name,
        email,
        password,
        jobTitle: jobTitle.id, // Assuming you want to send the job title's ID
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="w-[100%] h-[100%] bg-gray flex justify-center items-center ">
      <div className="w-[400px] h-[540px] bg-white rounded-[4px] px-[40px] py-[20px] flex flex-col">
        <div className="w-[100%] ">
          <p className="text-black font-inter text-[24px] text-center">
            Sign up
          </p>

          <div className="flex justify-center">
            <p className="text=[14px] text-textPrimary">
              Already have account?{" "}
            </p>
            <Link href="/login">
              <p className="text-link underline text=[14px] ml-[4px]">Log in</p>
            </Link>
          </div>
        </div>

        <div className="w-[100%]">
          <div className="w-[100%] mt-[40px]">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Full name"
            />
          </div>

          <div className="w-[100%] mt-[10px]">
            <Select
              label="Job title"
              options={jobTitles}
              value={jobTitle}
              setValue={setJobTitle}
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

          <div className="w-[100%] mt-[10px]">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />
          </div>
        </div>

        <div className="mt-auto">
          <Button label="Sign up" onClick={loginButtonClickHandler} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
