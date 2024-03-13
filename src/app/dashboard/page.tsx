import { headers } from "next/headers";
import DashboardData from "./dashboard-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "By Next.js",
};

export default function DashboardPage() {
  const headerRequest = headers();
  const user = JSON.parse(headerRequest.get("user") as string);

  return (
    <>
      <DashboardData mType={user.mType} mcode={user.mcode} />
    </>
  );
}
