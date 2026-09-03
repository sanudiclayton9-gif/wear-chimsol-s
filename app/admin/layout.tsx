import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner dashboard — Wear Chimsol",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-shell">{children}</div>;
}
