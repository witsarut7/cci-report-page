import { NextRequest, NextResponse } from "next/server";
import { importJWK, jwtVerify } from "jose";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  try {
    // get cookie from cms
    const getAuthPndToken = headers().get("Cookie") as string;

    // get cookie from login
    const token = request.cookies.get("token")?.value;
    const apiKey = process.env.API_KEY;

    if (!token) {
      const getApiKey = await verifyApiKey(getAuthPndToken);
      if (getApiKey !== apiKey) {
        return NextResponse.redirect(
          new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
        );
      }
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
      new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
    );
  }
}

async function verifyApiKey(authPndToken: string) {
  try {
    const secretJWK = {
      kty: "oct",
      k: process.env.JOSE_SECRET,
    };
    const secretKey = await importJWK(secretJWK, "HS256");
    const { payload } = await jwtVerify(authPndToken, secretKey);

    return payload.apiKey as string;
  } catch (error) {
    throw error;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*"],
};
