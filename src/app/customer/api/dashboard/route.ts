import prisma from "@/lib/prisma";
import { pnd, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyJson = (await req.json()) as Prisma.pndCreateInput;

    const createData = await prisma.pnd.create({ data: bodyJson });

    return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ", pnd: createData });
  } catch (error) {
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    // pagination
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const offset = await getOffset(Number(page), Number(limit));

    // filter
    const startDate = searchParams.get("startDate") as string;
    const endDate = searchParams.get("endDate") as string;
    const search = searchParams.get("search") as string;

    if (!isValidDate(startDate) && !isValidDate(endDate) && !search) {
      const findPnd = (await prisma.$queryRaw(
        Prisma.sql`SELECT * FROM pnd ORDER BY id DESC LIMIT ${Number(
          limit
        )} OFFSET ${offset}`
      )) as pnd[];

      // data count
      const dataCount = await prisma.pnd.count();
      const pageCount = await getPageCount(Number(limit), dataCount);

      return NextResponse.json({
        pnd: findPnd,
        count: dataCount,
        pageCount,
      });
    }

    if (isValidDate(startDate) && isValidDate(endDate)) {
      const findPnd = (await prisma.$queryRaw(
        Prisma.sql`SELECT * FROM pnd WHERE STR_TO_DATE(datepaid, '%d/%m/%Y') >= ${startDate} AND STR_TO_DATE(datepaid, '%d/%m/%Y') <= ${endDate} AND (idcardno LIKE CONCAT('%', ${
          search || ""
        }, '%') OR name LIKE CONCAT('%', ${
          search || ""
        }, '%') OR mcode LIKE CONCAT('%', ${
          search || ""
        }, '%')) ORDER BY id DESC LIMIT ${Number(limit)} OFFSET ${offset}`
      )) as pnd[];

      // data count
      const count = (await prisma.$queryRaw(
        Prisma.sql`SELECT * FROM pnd WHERE STR_TO_DATE(datepaid, '%d/%m/%Y') >= ${startDate} AND STR_TO_DATE(datepaid, '%d/%m/%Y') <= ${endDate} AND (idcardno LIKE CONCAT('%', ${
          search || ""
        }, '%') OR name LIKE CONCAT('%', ${
          search || ""
        }, '%') OR mcode LIKE CONCAT('%', ${search || ""}, '%'))`
      )) as pnd[];

      const dataCount = count.length;
      const pageCount = await getPageCount(Number(limit), dataCount);

      return NextResponse.json({
        pnd: findPnd,
        count: dataCount,
        pageCount,
      });
    } else if (search) {
      const findPnd = (await prisma.$queryRaw(
        Prisma.sql`SELECT * FROM pnd WHERE idcardno LIKE CONCAT('%', ${
          search || ""
        }, '%') OR name LIKE CONCAT('%', ${
          search || ""
        }, '%') OR mcode LIKE CONCAT('%', ${
          search || ""
        }, '%') ORDER BY id DESC LIMIT ${Number(limit)} OFFSET ${offset}`
      )) as pnd[];

      // data count
      const count = (await prisma.$queryRaw(
        Prisma.sql`SELECT * FROM pnd WHERE idcardno LIKE CONCAT('%', ${
          search || ""
        }, '%') OR name LIKE CONCAT('%', ${
          search || ""
        }, '%') OR mcode LIKE CONCAT('%', ${search || ""}, '%')`
      )) as pnd[];

      const dataCount = count.length;
      const pageCount = await getPageCount(Number(limit), dataCount);

      return NextResponse.json({
        pnd: findPnd,
        count: dataCount,
        pageCount,
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ids = (await req.json()) as number[];

    if (ids.length > 0) {
      await prisma.pnd.deleteMany({ where: { id: { in: ids } } });

      return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" });
    }

    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" });
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

function isValidDate(stringDate: string) {
  return !isNaN(Date.parse(stringDate));
}
