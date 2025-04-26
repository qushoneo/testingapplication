import { NextResponse } from 'next/server';
import { z } from 'zod';

export const generateValidationErrors = (
  errors: z.ZodError['errors']
): NextResponse => {
  let result = errors.map((err) => ({
    field: err.path[0],
    message: err.message,
  }));

  return NextResponse.json(result, { status: 400 });
};
