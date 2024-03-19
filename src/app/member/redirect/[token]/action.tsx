"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function setCmsToken(token: string) {
  try {
    // clear cookies
    cookies().delete("token");
    cookies().delete("cmsToken");

    // set cookies and redirect URL
    cookies().set("cmsToken", token);
    redirect("/member/login");
  } catch (error) {
    throw error;
  }
}
