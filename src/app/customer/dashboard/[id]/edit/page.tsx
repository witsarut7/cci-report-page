import { Metadata } from "next";
import DashboardEdit from "./dashboard-edit-content";

export const metadata: Metadata = {
  title: "Dashboard Edit Data",
  description: "By Next.js",
};

export default function DashboardEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <DashboardEdit params={params} />
    </>
  );
}
