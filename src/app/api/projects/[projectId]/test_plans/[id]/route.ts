import TestPlanController from "@/app/api/controllers/TestPlanController";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const testPlan = await TestPlanController.findById(Number(id));

  return NextResponse.json(testPlan);
}   