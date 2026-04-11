import { NextResponse } from "next/server";
import { rankingStore } from "@/lib/store";

export async function GET() {
  const entries = rankingStore.getAll();
  return NextResponse.json({ entries });
}
