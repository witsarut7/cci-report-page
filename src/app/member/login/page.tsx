import { Metadata } from "next";
import LoginContent from "./login-content";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Login Page",
  description: "By Next.js",
};

export default function LoginPage() {
  const headerRequest = headers();
  const getAuthPndToken = JSON.parse(headerRequest.get("mcode") as string);

  return (
    <div className="bg-[#CDD8FF]">
      <LoginContent mcode={getAuthPndToken.mcode} />
    </div>
  );
}
