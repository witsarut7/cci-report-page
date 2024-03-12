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
    const idCard = searchParams.get("idCard") as string;
    const dataCount = await prisma.pnd.count({
      where: { idcardno: idCard },
    });
    const pageCount = await getPageCount(Number(limit), dataCount);

    const findPnd = await prisma.pnd.findMany({
      where: { idcardno: idCard },
      skip: offset || 0,
      take: Number(limit) || 10,
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      pnd: findPnd,
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
