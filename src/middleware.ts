import { NextRequest, NextResponse } from "next/server";
import { importJWK, jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    // get cookie from cms
    const getAuthPndToken = request.cookies.get("cmsToken")?.value as string;

    // get cookie from member login
    const token = request.cookies.get("token")?.value;

    // get cookie from customer login
    const tokenBackOffice = request.cookies.get("back-office")?.value;

    const apiKey = process.env.API_KEY;

    if (
      !token &&
      getAuthPndToken &&
      request.nextUrl.pathname.startsWith("/member/login")
    ) {
      // verify token
      const secretJWK = {
        kty: "oct",
        k: process.env.JOSE_SECRET,
      };
      const secretKey = await importJWK(secretJWK, "HS256");
      const { payload } = await jwtVerify(getAuthPndToken, secretKey);

      // check x-api-key
      if (payload.apiKey !== apiKey) {
        return NextResponse.redirect(
          new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
        );
      }

      // set mcode from header
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
    } else if (
      token &&
      getAuthPndToken &&
      request.nextUrl.pathname.startsWith("/member/login")
    ) {
      // verify token
      const secretJWK = {
        kty: "oct",
        k: process.env.JOSE_SECRET,
      };
      const secretKey = await importJWK(secretJWK, "HS256");
      const { payload } = await jwtVerify(getAuthPndToken, secretKey);

      // check x-api-key
      if (payload.apiKey !== apiKey) {
        return NextResponse.redirect(
          new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
        );
      }

      // set mcode from header
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
    } else if (
      !token &&
      !getAuthPndToken &&
      request.nextUrl.pathname.startsWith("/member/login")
    ) {
      return NextResponse.redirect(
        new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
      );
    }

    // verify token
    if (token && request.nextUrl.pathname.startsWith("/member/dashboard")) {
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
    } else if (
      !token &&
      request.nextUrl.pathname.startsWith("/member/dashboard")
    ) {
      return NextResponse.redirect(
        new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
      );
    }

    if (
      !tokenBackOffice &&
      request.nextUrl.pathname.startsWith("/customer/dashboard")
    ) {
      return NextResponse.redirect(new URL("/customer/login", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL(`${process.env.ENDPOINT_REDIRECT}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    "/member/dashboard/:path*",
    "/member/login/:path*",
    "/customer/dashboard/:path*",
  ],
};
