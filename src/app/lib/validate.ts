import { JobTitle } from '@/types/JobTitle';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const fullNameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/;

const passwordRequirements = [
  'minimum 8 characters',
  'at least 1 number',
  'at least 1 special symbol',
];

const validatePassword = (password: string) => {
  return [
    password.length >= 8,
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ];
};

export const validateJobTitle = (jobTitle: JobTitle | null) => {
  if (jobTitle === null) {
    return 'Select Job title';
  }
};

export const validatePasswordField = (password: string) => {
  const validationResults = validatePassword(password);
  const validationErrors: string[] = [];
  if (!validationResults[0]) validationErrors.push(passwordRequirements[0]);
  if (!validationResults[1]) validationErrors.push(passwordRequirements[1]);
  if (!validationResults[2]) validationErrors.push(passwordRequirements[2]);

  return validationErrors.length > 0;
};

export const validateEmail = (email: string): string => {
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return '';
};

export const validateFullName = (name: string): string => {
  if (!fullNameRegex.test(name)) {
    return 'Please provide your First Name and Last Name';
  }

  return '';
};
