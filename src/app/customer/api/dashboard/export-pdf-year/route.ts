import prisma from "@/lib/prisma";
import { pnd, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mcode = searchParams.get("mcode") as string;
    const year = searchParams.get("year[value]") as string;

    const findPnd1 = (await prisma.$queryRaw(
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
                    mcode = ${mcode} AND LEFT ( docno, 4 ) = ${year} AND payouttax = 1`
    )) as pnd[];

    const findPnd2 = (await prisma.$queryRaw(
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
                    mcode = ${mcode} AND LEFT ( docno, 4 ) = ${year} AND payouttax = 2`
    )) as pnd[];

    const findPnd3 = (await prisma.$queryRaw(
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
                    mcode = ${mcode} AND LEFT ( docno, 4 ) = ${year} AND payouttax = 3`
    )) as pnd[];

    return NextResponse.json({
      pnd1: findPnd1[0]?.docno && findPnd1,
      pnd2: findPnd2[0]?.docno && findPnd2,
      pnd3: findPnd3[0]?.docno && findPnd3,
    });
  } catch (error) {
    throw error;
  }
}
