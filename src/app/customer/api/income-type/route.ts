import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const findData = await prisma.pnd_income_type.findMany();

    return NextResponse.json({ pnd_income_type: findData });
  } catch (error) {
    throw error;
  }
}
