import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const findData = await prisma.pnd_payout_tax.findMany();

    return NextResponse.json({ pnd_payout_tax: findData });
  } catch (error) {
    throw error;
  }
}
