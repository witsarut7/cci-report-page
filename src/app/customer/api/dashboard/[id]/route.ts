import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const findData = await prisma.pnd.findUnique({
      where: { id: Number(params.params.id) },
    });

    if (!findData) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลนี้ในระบบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pnd: findData });
  } catch (error) {
    throw error;
  }
}

export async function PATCH(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const findData = await prisma.pnd.findUnique({
      where: { id: Number(params.params.id) },
    });

    if (!findData) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลนี้ในระบบ" },
        { status: 404 }
      );
    }

    const bodyJson = (await req.json()) as Prisma.pndUpdateInput;

    const updateData = await prisma.pnd.update({
      where: { id: findData.id },
      data: bodyJson,
    });

    return NextResponse.json({ message: "แก้ไขข้อมูลสำเร็จ", pnd: updateData });
  } catch (error) {
    throw error;
  }
}
