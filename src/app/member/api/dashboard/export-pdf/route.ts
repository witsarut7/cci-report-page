import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const ids = searchParams.get("ids");
    const idsArray = ids?.split(",").map(Number);

    const findPnd = await prisma.pnd.findMany({
      where: { id: { in: idsArray } },
    });

    return NextResponse.json({ pnd: findPnd });
  } catch (error) {
    throw error;
  }
}
