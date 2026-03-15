import { PortalAuthProvider } from "@/context/PortalAuthContext";

export const metadata = {
  title: "Login — McCann & Curran Realty",
  description: "Sign in to the McCann & Curran Realty client portal",
};

export default function LoginLayout({ children }) {
  return (
    <PortalAuthProvider>
      {children}
    </PortalAuthProvider>
  );
}
