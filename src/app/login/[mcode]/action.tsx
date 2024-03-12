"use server";

import { SignJWT, importJWK } from "jose";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { Prisma, ali_member } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function login(idCard: string, param: Params) {
  try {
    const member = (await prisma.$queryRaw(
      Prisma.sql`SELECT * FROM ali_member WHERE id_card = ${idCard} AND mcode = ${param?.mcode};`
    )) as ali_member[];

    if (member?.length < 1) {
      return null;
    }

    const mcode = member[0]?.mcode;
    const mType = member[0]?.mtype;

    // sign token
    const secretJWK = {
      kty: "oct",
      k: process.env.JOSE_SECRET,
    };
    const secretKey = await importJWK(secretJWK, "HS256");
    const token = await new SignJWT({ mcode, idCard, mType })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);

    cookies().set("token", token);
    redirect(`/dashboard/${mcode}`);
  } catch (error) {
    throw error;
  }
}
