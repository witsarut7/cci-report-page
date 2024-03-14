import { Metadata } from "next";
import LoginContent from "./login-content";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Login Page",
  description: "By Next.js",
};

export default function LoginPage() {
  // get cookie from cms
  const getAuthPndToken = headers().get("Cookie") as string;

  return (
    <>
      <LoginContent authPndToken={getAuthPndToken} />
    </>
  );
}
