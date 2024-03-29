import DashboardData from "./dashboard-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "By Next.js",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardData />
    </>
  );
}
