import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Client Portal — McCann & Corran",
  description: "Landlord portal for McCann & Corran Realty",
};

export default function PortalLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
