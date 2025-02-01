"use client";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { Select } from "../../components/Select";
import { JobTitle } from "../../types/JobTitle";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";
import { jobTitles } from "../lib/jobTitles";

const passwordRequirements = [
  "minimum 8 characters",
  "at least 1 number",
  "at least 1 special symbol",
];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const fullNameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/;

const Signup = () => {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<JobTitle | null>(null);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  useEffect(() => {
    if (user) {
      router.push("/projects");
    }
  }, [user, router]);

  const validateEmail = (email: string): string => {
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const validateFullName = (name: string): string => {
    if (!fullNameRegex.test(name)) {
      return "Please provide your First Name and Last Name";
    }

    return "";
  };

  const validatePassword = (password: string) => {
    return [
      password.length >= 8,
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
  };

  const validatePasswordField = (password: string) => {
    const validationResults = validatePassword(password);
    const validationErrors: string[] = [];
    if (!validationResults[0]) validationErrors.push(passwordRequirements[0]);
    if (!validationResults[1]) validationErrors.push(passwordRequirements[1]);
    if (!validationResults[2]) validationErrors.push(passwordRequirements[2]);

    return validationErrors.length > 0;
  };

  const validateJobTitle = (jobTitle: JobTitle | null) => {
    if (jobTitle === null) {
      return "Select Job title";
    }
  };

  const validateForm = () => {
    let validationErrors: { field: string; message: string }[] = [];

    const emailError = validateEmail(email);
    if (emailError) {
      validationErrors.push({ field: "email", message: emailError });
    }

    const nameError = validateFullName(name);
    if (nameError) {
      validationErrors.push({ field: "name", message: nameError });
    }

    const passwordError = validatePasswordField(password);
    if (passwordError) {
      validationErrors.push({ field: "password", message: "error" });
    }

    const jobTitleError = validateJobTitle(jobTitle);
    if (jobTitleError) {
      validationErrors.push({ field: "jobTitle", message: jobTitleError });
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
        router.push("/projects");
      })
      .catch((e) => {
        setErrors(e.response.data.errors);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-[100%] h-[100%] bg-gray flex justify-center items-center ">
      <div className="w-[400px] h-[540px] bg-white rounded-[4px] px-[40px] py-[20px] flex flex-col">
        <div className="w-[100%] ">
          <p className="text-black font-inter text-[24px] text-center">
            Sign up
          </p>

          <div className="flex justify-center">
            <p className="text-sm text-textPrimary">Already have an account?</p>
            <Link href="/login">
              <p className="text-link underline text-sm ml-[4px]">Log in</p>
            </Link>
          </div>
        </div>

        <div className="w-[100%]">
          <div className="w-[100%] mt-[40px]">
            <Input
              value={name}
              maxLength={25}
              onChange={(e) =>
                setName(
                  e.target.value.replace(/\b\w/g, (char) => char.toUpperCase())
                )
              }
              label="Full name"
              hasError={!!errors.find((error) => error.field === "name")}
              errorMessage={
                errors.find((error) => error.field === "name")?.message
              }
            />
          </div>

          <div className="w-[100%] mt-[10px]">
            <Select
              label="Job title"
              options={jobTitles}
              value={jobTitle}
              setValue={setJobTitle}
              hasError={!!errors.find((error) => error.field === "jobTitle")}
              errorMessage={
                errors.find((error) => error.field === "jobTitle")?.message
              }
            />
          </div>

          <div className="w-[100%] mt-[10px]">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              hasError={!!errors.find((error) => error.field === "email")}
              errorMessage={
                errors.find((error) => error.field === "email")?.message
              }
            />
          </div>

          <div className="w-[100%] mt-[10px]">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              showPasswordRequirements={true}
              hasError={!!errors.find((error) => error.field === "password")}
            />
          </div>
        </div>

        <div className="mt-auto">
          <Button
            label={"Sign up"}
            disabled={loading}
            onClick={signupButtonClickHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
