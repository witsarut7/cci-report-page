"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function setCmsToken(token: string) {
  try {
    cookies().set("cmsToken", token);
    redirect("/login");
  } catch (error) {
    throw error;
  }
}
