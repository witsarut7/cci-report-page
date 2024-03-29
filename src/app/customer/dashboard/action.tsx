"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
  try {
    // clear cookies
    cookies().delete("back-office");

    redirect("/customer/login");
  } catch (error) {
    throw error;
  }
}
