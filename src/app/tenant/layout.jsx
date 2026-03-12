import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Tenant Portal — McCann & Corran",
  description: "Tenant portal for McCann & Corran Realty",
};

export default function TenantLayout({ children }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
