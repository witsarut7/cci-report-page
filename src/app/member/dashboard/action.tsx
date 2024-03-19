"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
  try {
    // clear cookies
    cookies().delete("token");
    cookies().delete("cmsToken");

    // set cookies and redirect URL
    redirect(`${process.env.ENDPOINT_REDIRECT}`);
  } catch (error) {
    throw error;
  }
}
