import { NextRequest, NextResponse } from "next/server";
import { importJWK, jwtVerify } from "jose";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const getApiKey = headers().get("x-api-key");
  const apiKey = process.env.API_KEY;

  if (getApiKey !== apiKey) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // verify token
  if (token && request.nextUrl.pathname.startsWith("/dashboard/")) {
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
  } else if (request.nextUrl.pathname.startsWith("/dashboard/")) {
    const param = request.nextUrl.pathname.replace("/dashboard/", "");
    return NextResponse.redirect(new URL(`/login/${param}`, request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*"],
};
