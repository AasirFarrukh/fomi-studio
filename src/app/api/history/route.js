import { NextResponse } from "next/server";
import { getGenerations } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ generations: getGenerations() });
}
