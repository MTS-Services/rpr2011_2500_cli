"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PortalAuthContext = createContext(null);

// Dummy user
const DUMMY_USER = {
  id: "landlord_001",
  name: "Joe Doyle",
  email: "joe.doyle@email.com",
  phone: "+353 86 123 4567",
  address: "124 Ashwood Crescent, Dublin, Ireland",
  ppsNumber: "5432109WA",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  role: "landlord",
};

const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsYW5kbG9yZF8wMDEiLCJuYW1lIjoiSm9lIERveWxlIiwicm9sZSI6ImxhbmRsb3JkIiwiaWF0IjoxNzA5OTk5OTk5fQ.dummy_signature";

export function PortalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    if (token === DUMMY_TOKEN) {
      setUser(DUMMY_USER);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Accept any credentials that match pattern
    if (email && password.length >= 4) {
      localStorage.setItem("portal_token", DUMMY_TOKEN);
      setUser(DUMMY_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("portal_token");
    setUser(null);
  };

  return (
    <PortalAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
