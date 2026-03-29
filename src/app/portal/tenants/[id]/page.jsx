"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";
import {
    ArrowLeft, Phone, Mail, MapPin, Calendar,
    ChevronRight, Clock, DollarSign,
    CheckCircle2, AlertCircle, MessageSquare, Paperclip
} from "lucide-react";

// Helper: Map tenancy status to display label
const mapTenancyStatus = (status) => {
    const mapping = {
        "ACTIVE": "Active Tenancy",
        "NOTICE": "Notice Served",
        "ENDED": "Tenancy Ended"
    };
    return mapping[status] || status;
};

// Helper: Get status badge color
const getTenancyStatusColor = (status) => {
    const colors = {
        "ACTIVE": "bg-teal-100 text-teal-800",
        "NOTICE": "bg-orange-100 text-orange-800",
        "ENDED": "bg-slate-100 text-slate-600"
    };
    return colors[status] || "bg-slate-100 text-slate-600";
};

// Helper: Get rent status badge color
const getRentStatusColor = (rentStatus) => {
    const colors = {
        "PAID": "bg-teal-100 text-teal-800",
        "PENDING": "bg-amber-100 text-amber-800",
        "OVERDUE": "bg-red-100 text-red-800"
    };
    return colors[rentStatus] || "bg-slate-100 text-slate-600";
};

// Helper: Get name initials
const getNameInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

export default function TenantDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const tenancyId = params.id;

    const [tenancy, setTenancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tenancy details from API
    useEffect(() => {
        const fetchTenancy = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!tenancyId) {
                    throw new Error("Tenancy ID is missing");
                }

                const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/landlord/${tenancyId}`;
                console.log("Fetching from:", url);
                
                const response = await authenticatedFetch(url);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
                }
                
                const data = await response.json();
                console.log("Tenancy data received:", data);
                
                if (data.success && data.data) {
                    setTenancy(data.data);
                } else {
                    throw new Error(data.message || "Failed to load tenancy details");
                }
            } catch (err) {
                console.error("Error fetching tenancy:", err);
                setError(err.message);
                Swal.fire("Error", err.message, "error");
            } finally {
                setLoading(false);
            }
        };
        
        if (tenancyId) {
            fetchTenancy();
        }
    }, [tenancyId]);

    // menu actions removed

    // Show loading state
    if (loading) {
        return (
            <PortalShell>
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </PortalShell>
        );
    }

    // Show error state
    if (error || !tenancy) {
        return (
            <PortalShell>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700 font-medium">{error || "Tenancy not found"}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                        Go Back
                    </button>
                </div>
            </PortalShell>
        );
    }

    return (
        <PortalShell>
            {/* Header with back button */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">{tenancy.tenant.name}</h1>
                    <p className="text-sm text-slate-500 mt-1">{tenancy.property.address} • {tenancy.property.county}</p>
                </div>
                {/* three-dot menu removed */}
            </div>

            {/* Status badge and quick info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Status</p>
                    <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 ${getTenancyStatusColor(tenancy.status)}`}>
                        {mapTenancyStatus(tenancy.status)}
                    </span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Monthly Rent</p>
                    <p className="text-xl font-bold text-slate-900">€{tenancy.rent}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Rent Status</p>
                    <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 ${getRentStatusColor(tenancy.rentStatus)}`}>
                        {tenancy.rentStatus}
                    </span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Rent Due Day</p>
                    <p className="text-sm font-semibold text-teal-600">{tenancy.rentDueDay}st of month</p>
                </div>
            </div>

                    {/* Tabs removed - only overview shown */}

            {/* Overview content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</p>
                                    <p className="text-base font-semibold text-slate-900">{tenancy.tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</p>
                                    <p className="text-base text-slate-700">{tenancy.tenant.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tenancy Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tenancy Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property</p>
                                        <p className="text-base font-semibold text-slate-900">{tenancy.property.name}</p>
                                    </div>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        <MapPin size={18} className="text-teal-600" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Start Date</p>
                                        <p className="text-base text-slate-700">{new Date(tenancy.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">End Date</p>
                                        <p className="text-base text-slate-700">{new Date(tenancy.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                                    </div>
                                </div>

                                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Monthly Rent</p>
                                            <p className="text-lg font-bold text-teal-700">€{tenancy.rent}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Due Day</p>
                                            <p className="text-lg font-bold text-teal-700">{tenancy.rentDueDay}st</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-teal-600 uppercase mb-1">RTB Status</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <CheckCircle2 size={16} className="text-teal-600" />
                                                <span className="text-sm font-semibold text-teal-700">{tenancy.rtbStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">RTB Number</p>
                                    <p className="text-base font-mono text-slate-700">{tenancy.rtbNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Contact Card */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border border-teal-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg font-bold`}>
                                    {getNameInitials(tenancy.tenant.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{tenancy.tenant.name}</p>
                                    <p className="text-xs text-slate-600">{tenancy.property.county}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`mailto:${tenancy.tenant.email}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    aria-label="Send email"
                                >
                                    <Mail size={18} className="text-teal-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{tenancy.tenant.email}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                                </a>
                            </div>

                            <button className="w-full mt-4 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                                <MessageSquare size={16} /> Send Message
                            </button>
                        </div>

                        {/* Property Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900">Property Details</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Address</p>
                                    <p className="text-slate-700 font-medium">{tenancy.property.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Type</p>
                                    <p className="text-slate-700 font-medium">{tenancy.property.propertyType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Bedrooms/Bathrooms</p>
                                    <p className="text-slate-700 font-medium">{tenancy.property.bedrooms} bed / {tenancy.property.bathrooms} bath</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Documents removed for landlord view */}

            {/* Activity removed for landlord view */}
        </PortalShell>
    );
}
