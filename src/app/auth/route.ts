import { SignJWT, importJWK } from "jose";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = headers().get("x-api-key") as string;
    const mcode = headers().get("mcode") as string;

    const secretJWK = {
      kty: "oct",
      k: process.env.JOSE_SECRET,
    };
    const secretKey = await importJWK(secretJWK, "HS256");
    const token = await new SignJWT({ apiKey, mcode })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(secretKey);

    return NextResponse.json({
      AuthPndToken: token,
    });
  } catch (error) {
    throw error;
  }
}
