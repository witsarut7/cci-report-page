import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyJson = await req.json();

    let countObject: number[] = [];
    bodyJson.jsonResult.filter((value: any) => {
      countObject.push(Object.keys(value).length);
    });
    const differentValue = await findDifferentValue(countObject);
    if (!differentValue) {
      return NextResponse.json({
        message: "Bad Request",
        status: 404,
      });
    }

    if (bodyJson.jsonResult.length > 0) {
      await prisma.pnd.createMany({ data: bodyJson.jsonResult });

      return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ", status: 200 });
    }
    return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ", status: 200 });
  } catch (error) {
    throw error;
  }
}

async function findDifferentValue(arr: number[]) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== arr[i + 1]) {
      return false;
    }
  }
  return true;
}
