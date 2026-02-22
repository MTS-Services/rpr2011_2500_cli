"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function LoginPage() {
  const { login } = usePortalAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password);
    if (ok) {
      router.push("/portal/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-indigo-200/60" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-8 text-center border-b border-gray-100">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="McCann & Curran" width={42} height={42} />
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                McCann &amp; Curran
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium tracking-widest uppercase">
              Landlord Portal
            </p>
          </div>

          {/* Form */}
          <div className="px-10 py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">Login</h2>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-10 pb-8 text-center">
            <p className="text-sm text-slate-500">
              Need help? Contact us at{" "}
              <a
                href="mailto:info@mccannandcurran.ie"
                className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
              >
                info@mccannandcurran.ie <ArrowRight size={13} />
              </a>
            </p>
          </div>

          {/* Copyright */}
          <div className="bg-gray-50 px-10 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-slate-400">
              © 2024 McCann &amp; Curran. Confidential and Proprietary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
