import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Tenant Portal — McCann & Curran Realty",
  description: "Tenant portal for McCann & Curran Realty Realty",
};

export default function TenantLayout({ children }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
