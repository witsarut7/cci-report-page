import { Metadata } from "next";
import DashboardCreate from "./dashboard-create-content";

export const metadata: Metadata = {
  title: "Dashboard Create Data",
  description: "By Next.js",
};

export default function DashboardEditPage() {
  return (
    <>
      <DashboardCreate />
    </>
  );
}
