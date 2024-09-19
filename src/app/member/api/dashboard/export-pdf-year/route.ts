import prisma from "@/lib/prisma";
import { pnd, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mcode = searchParams.get("mcode") as string;
    const year = searchParams.get("year[value]") as string;

    const findPnd = (await prisma.$queryRaw(
      Prisma.sql`SELECT
                    LEFT ( docno, 4 ) AS docno,
                    name,
                    address,
                    idcardno,
                    RIGHT ( datepaid, 4 ) AS datepaid,
                    incometype,
                    percentage,
                    SUM( income ) AS income,
                    SUM( wht ) AS wht,
                    payouttax,
                    mcode 
                FROM
                    pnd 
                WHERE
                    mcode = ${mcode} AND LEFT ( docno, 4 ) = ${year}`
    )) as pnd[];

    return NextResponse.json({ pnd: findPnd });
  } catch (error) {
    throw error;
  }
}
