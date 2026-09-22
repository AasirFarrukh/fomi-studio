import { NextResponse } from "next/server";
import { imageModels, videoModels } from "@/data/models";

export async function GET() {
  return NextResponse.json({ image: imageModels, video: videoModels });
}
