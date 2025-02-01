import { NextRequest, NextResponse } from "next/server";
import { getCompanyIdFromToken } from "../../lib/getCompanyIdFromToken";
import { getProject } from "../../lib/getProjects";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;

    const { projectId } = await params;

    if (!token) {
      throw new Error("No token");
    }

    const { id, companyId } = await getCompanyIdFromToken(token);

    if (!companyId || !id) {
      throw new Error("Cannot find company id or user id");
    }

    const project = await getProject(parseInt(projectId), companyId);

    if (companyId !== project?.companyId) {
      return NextResponse.json(
        { error: "Unathorized to view this project" },
        { status: 403 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
