import { Severity } from "@prisma/client";
import { z } from "zod";

export const TestCaseSchema = z.object({
  name: z.string().min(4, { message: "At least 3 symbols" }),
  description: z.string().optional(),
  severity: z.nativeEnum(Severity).nullable().optional(),
  folderId: z.number(),
});
