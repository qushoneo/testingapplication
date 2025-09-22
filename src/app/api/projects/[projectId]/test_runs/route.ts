import { NextRequest, NextResponse } from "next/server";
import TestRunController from "@/app/api/controllers/TestRunController";
import { z } from "zod";
import { generateValidationErrors } from "@/app/api/lib/generateValidationErrors";
import { TestRun } from "@prisma/client";

const createTestRunSchema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 symbols" }).max(30, { message: "Name must be less than 30 symbols" }),
  projectId: z.number(),
  userId: z.number(),
  testPlanId: z.number(),
  status: z.string(),
  testCaseIds: z.array(z.number()),
});

const editTestRunSchema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 symbols" }).max(30, { message: "Name must be less than 30 symbols" }).optional(),
  projectId: z.number().optional(),
  userId: z.number().optional(),
  testPlanId: z.number().optional(),
  status: z.string().optional(),
  testCaseIds: z.array(z.number()).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  const testRuns = await TestRunController.getAll(Number(projectId));

  return NextResponse.json(testRuns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = createTestRunSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const testRun = await TestRunController.create(validation.data as Pick<TestRun, "name" | "projectId" | "userId" | "testPlanId" | "status">, validation.data.testCaseIds);

  if (!testRun) {
    return NextResponse.json({ error: "Failed to create test run" }, { status: 500 });
  }

  return NextResponse.json(testRun);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ testRunIds: number[] }> }) {
  const { testRunIds } = await params;

  const testRun = await TestRunController.bulkDelete(testRunIds);

  return NextResponse.json(testRun);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ testRunId: number }> }) {
  const { testRunId } = await params;

  const body = await req.json();

  const validation = editTestRunSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const testRun = await TestRunController.update(testRunId, validation.data as Pick<TestRun, "name" | "projectId" | "userId" | "testPlanId" | "status">, validation.data.testCaseIds);

  return NextResponse.json(testRun);
}