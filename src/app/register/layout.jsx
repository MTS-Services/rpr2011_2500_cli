import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Register — McCann & Curran Realty",
  description: "Create your McCann & Curran Realty client portal account",
};

export default function RegisterLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
