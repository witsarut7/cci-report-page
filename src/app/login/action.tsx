"use server";

import { SignJWT, importJWK, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { Prisma, ali_member } from "@prisma/client";

export async function login(idCard: string, authPndToken: string) {
  try {
    const mcode = await verifyMcode(authPndToken);
    const member = (await prisma.$queryRaw(
      Prisma.sql`SELECT * FROM ali_member WHERE id_card = ${idCard} OR id_tax = ${idCard} AND mcode = ${mcode};`
    )) as ali_member[];

    if (member?.length < 1) {
      return null;
    }
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
    redirect("/dashboard/");
  } catch (error) {
    throw error;
  }
}

async function verifyMcode(authPndToken: string) {
  try {
    const secret = {
      kty: "oct",
      k: process.env.JOSE_SECRET,
    };
    const sKey = await importJWK(secret, "HS256");
    const { payload } = await jwtVerify(authPndToken, sKey);

    return payload.mcode as string;
  } catch (error) {
    throw error;
  }
}
