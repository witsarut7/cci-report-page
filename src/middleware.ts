import { NextRequest, NextResponse } from "next/server";
import { importJWK, jwtVerify } from "jose";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const getApiKey = headers().get("x-api-key") as string;
    const apiKey = process.env.API_KEY;

    if (getApiKey !== apiKey && !token) {
      return NextResponse.redirect(
        new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
      );
    }

    // verify token
    if (token) {
      const secretJWK = {
        kty: "oct",
        k: process.env.JOSE_SECRET,
      };
      const secretKey = await importJWK(secretJWK, "HS256");
      const { payload } = await jwtVerify(token, secretKey);

      // set user from header
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set(
        "user",
        JSON.stringify({
          mcode: payload.mcode,
          idCard: payload.idCard,
          mType: payload.mType,
        })
      );
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      return response;
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL("`${process.env.ENDPOINT_REDIRECT}`", request.url)
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*"],
};
