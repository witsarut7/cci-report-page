import { Metadata } from "next";
import LoginContent from "./login-content";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Login Page",
  description: "By Next.js",
};

export default function LoginPage() {
  const getMcode = headers().get("mcode") as string;

  return (
    <>
      <LoginContent mcode={getMcode} />
    </>
  );
}
