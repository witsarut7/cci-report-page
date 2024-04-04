import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const findData = await prisma.pnd_percentage.findMany();

    return NextResponse.json({ pnd_percentage: findData });
  } catch (error) {
    throw error;
  }
}
