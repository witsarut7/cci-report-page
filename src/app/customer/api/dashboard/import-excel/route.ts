import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyJson = await req.json();

    if (bodyJson.jsonResult.length > 0) {
      await prisma.pnd.createMany({ data: bodyJson.jsonResult });

      return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ", data: {} });
    }
    return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ", data: {} });
  } catch (error) {
    throw error;
  }
}
