import { NextRequest, NextResponse } from "next/server";
import FolderController from "../controllers/FolderController";

export async function POST(req: NextRequest) {
  const { folderIds } = await req.json();

  const folders = await FolderController.getFoldersByIds(folderIds);

  return NextResponse.json(folders);
}
