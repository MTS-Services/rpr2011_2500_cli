import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Portal — McCann & Corran",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
