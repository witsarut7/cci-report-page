import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // pagination
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const offset = await getOffset(Number(page), Number(limit));

    // data count
    const mcode = searchParams.get("mcode") as string;
    const dataCount = await prisma.pnd.count({
      where: { mcode: mcode },
    });
    const pageCount = await getPageCount(Number(limit), dataCount);

    const findPnd = await prisma.pnd.findMany({
      where: { mcode: mcode },
      skip: offset || 0,
      take: Number(limit) || 100,
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      pnd: findPnd,
      count: dataCount,
      pageCount,
    });
  } catch (error) {
    throw error;
  }
}

async function getOffset(page: number, limit: number) {
  return (page - 1) * limit;
}

async function getPageCount(limit: number, total: number) {
  return Math.ceil(total / limit);
}
