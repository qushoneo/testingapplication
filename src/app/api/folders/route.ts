import { NextRequest, NextResponse } from "next/server";
import FolderController from "../controllers/FolderController";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json(
      { error: "Missing ids parameter" },
      { status: 400 }
    );
  }

  const folderIds = idsParam.split(",").map((id) => parseInt(id.trim()));
  const folders = await FolderController.getFoldersByIds(folderIds);

  return NextResponse.json(folders);
}

export async function POST(req: NextRequest) {
  const { folderIds } = await req.json();

  const folders = await FolderController.getFoldersByIds(folderIds);

  return NextResponse.json(folders);
}
