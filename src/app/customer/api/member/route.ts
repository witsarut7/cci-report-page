import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mcode = searchParams.get("mcode") as string;

    const member = await prisma.ali_member.findUnique({
      where: { mcode: mcode },
    });

    return NextResponse.json({ member: member });
  } catch (error) {
    throw error;
  }
}
