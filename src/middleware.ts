import { NextRequest, NextResponse } from "next/server";
import { importJWK, jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    // get cookie from cms
    const getAuthPndToken = request.cookies.get("cmsToken")?.value as string;

    // get cookie from login
    const token = request.cookies.get("token")?.value;
    const apiKey = process.env.API_KEY;

    if (!token && getAuthPndToken) {
      const secretJWK = {
        kty: "oct",
        k: process.env.JOSE_SECRET,
      };
      const secretKey = await importJWK(secretJWK, "HS256");
      const { payload } = await jwtVerify(getAuthPndToken, secretKey);

      if (payload.apiKey !== apiKey) {
        return NextResponse.redirect(
          new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
        );
      }

      // set user from header
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set(
        "mcode",
        JSON.stringify({
          mcode: payload.mcode,
        })
      );
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      return response;
    }

    // verify token
    if (token && request.nextUrl.pathname.startsWith("/dashboard")) {
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
    } else {
      return NextResponse.redirect(
        new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
      );
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*"],
};
