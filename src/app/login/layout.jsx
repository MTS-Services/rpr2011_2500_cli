import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Login — McCann & Corran",
  description: "Sign in to the McCann & Corran client portal",
};

export default function LoginLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
