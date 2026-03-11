import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Register — McCann & Corran",
  description: "Create your McCann & Corran client portal account",
};

export default function RegisterLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
