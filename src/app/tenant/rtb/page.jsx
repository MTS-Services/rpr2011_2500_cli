"use client";

import TenantShell from "@/components/tenant/TenantShell";
import { Shield, CheckCircle2, Hash, FileText, AlertCircle, Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { authenticatedFetch } from "@/utils/authFetch";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export default function TenantRTBPage() {
  const [rtbData, setRtbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRTBDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/my/rtb`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch RTB registration details");
        }
        const json = await res.json();
        setRtbData(json.data);
      } catch (err) {
        console.warn("Error fetching RTB details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRTBDetails();
  }, []);

  if (isLoading) {
    return (
      <TenantShell>
        <div className="mb-3 xl:mb-5">
          <h1 className="text-3xl font-bold text-slate-800">RTB Registration</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Your tenancy registration with the Residential Tenancies Board (RTB)
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-teal-600 animate-spin" />
        </div>
      </TenantShell>
    );
  }

  if (error || !rtbData) {
    return (
      <TenantShell>
        <div className="mb-3 xl:mb-5">
          <h1 className="text-3xl font-bold text-slate-800">RTB Registration</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Your tenancy registration with the Residential Tenancies Board (RTB)
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Unable to load RTB registration details</p>
              <p className="text-sm text-red-700 mt-1">
                {error || "No RTB registration found for your tenancy."}
              </p>
            </div>
          </div>
        </div>
      </TenantShell>
    );
  }
  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">RTB Registration</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Your tenancy registration with the Residential Tenancies Board (RTB)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Status card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                <Shield size={26} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-800">Registration Status</h2>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
                    rtbData?.rtbStatus === "Active"
                      ? "bg-teal-100 text-teal-700"
                      : rtbData?.rtbStatus === "Inactive"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    <CheckCircle2 size={14} /> {rtbData?.rtbStatus || "—"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1.5">
                  Your tenancy is registered with the RTB as required under the Residential Tenancies Act.
                  This confirms you have the full legal rights and protections of a registered tenant.
                </p>
              </div>
            </div>
          </div>

          {/* Registration details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <Hash size={16} className="text-teal-600" />
              <h3 className="text-base font-bold text-slate-800">Registration Details</h3>
            </div>
            <div className="px-5 py-2">
              <InfoRow label="RTB Registration Number" value={rtbData?.rtbNumber || "—"} mono />
              <InfoRow label="Registration Date" value={formatDate(rtbData?.rtbRegistrationDate)} />
              <InfoRow label="Registration Expiry" value={formatDate(rtbData?.rtbExpiryDate)} />
              <InfoRow label="Tenancy Start Date" value={formatDate(rtbData?.startDate)} />
              <InfoRow label="Property" value={`${rtbData?.property?.address}, ${rtbData?.property?.county}` || "—"} />
              <InfoRow label="Landlord" value={rtbData?.landlord?.name || "—"} />
            </div>
          </div>

          {/* Tenant & Landlord Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <FileText size={16} className="text-teal-600" />
              <h3 className="text-base font-bold text-slate-800">Tenancy Information</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tenant</p>
                <p className="text-sm font-semibold text-slate-800">{rtbData?.tenant?.name || "—"}</p>
                <p className="text-xs text-slate-500 mt-1">{rtbData?.tenant?.email || "—"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Landlord</p>
                <p className="text-sm font-semibold text-slate-800">{rtbData?.landlord?.name || "—"}</p>
                <p className="text-xs text-slate-500 mt-1">{rtbData?.landlord?.email || "—"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Property</p>
                <p className="text-sm font-semibold text-slate-800">{rtbData?.property?.name || "—"}</p>
                <p className="text-xs text-slate-500 mt-1">{rtbData?.property?.address || "—"}</p>
                <p className="text-xs text-slate-500">{rtbData?.property?.county || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* What is RTB */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Info size={16} className="text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">What is the RTB?</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The <strong className="text-slate-700">Residential Tenancies Board (RTB)</strong> is Ireland&apos;s
              independent statutory body that regulates the rental sector. All private tenancies must be
              registered with the RTB within one month of a tenancy commencing.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {[
                "Dispute resolution between landlords and tenants",
                "Maintains a register of tenancies nationwide",
                "Enforces tenants' and landlords' rights",
                "Provides free guidance and information",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-teal-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://www.rtb.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              Visit rtb.ie →
            </a>
          </div>

          {/* Tenant rights */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Shield size={16} className="text-teal-600" />
              <h3 className="text-base font-bold text-teal-800">Your Tenant Rights</h3>
            </div>
            <ul className="space-y-2 text-sm text-teal-700">
              {[
                "Right to peaceful occupation",
                "Right to adequate notice before termination",
                "Right to a rent review not more than once per year",
                "Right to refer disputes to the RTB",
              ].map((right) => (
                <li key={right} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
                  {right}
                </li>
              ))}
            </ul>
          </div>

          {/* Dispute info */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Need help with a dispute?</p>
                <p className="text-xs text-amber-700 mt-1">
                  Contact your letting agent or visit rtb.ie to submit a dispute application free of charge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
