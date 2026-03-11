"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import {
    ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, Download,
    Eye, Edit, Share2, MoreVertical, ChevronRight, Clock, DollarSign,
    CheckCircle2, AlertCircle, MessageSquare, Paperclip
} from "lucide-react";

// Mock tenant data - replace with API call
const TENANT_DATA = {
    1: {
        id: 1,
        name: "Ellis Davis",
        initials: "ED",
        color: "bg-teal-500",
        email: "ellis.davis@email.com",
        mobile: "087-965-6692",
        dob: "14 Mar 1990",
        pps: "1234567SA",
        property: "Apt 4 Willow Court",
        county: "Dublin 4",
        status: "Let",
        startDate: "Aug 1, 2023",
        endDate: "Jul 31, 2024",
        rent: "€1,450",
        rentDueDay: "1st",
        lastPayment: "Mar 1, 2026",
        nextDueDate: "Apr 1, 2026",
        documents: [
            { id: 1, name: "Tenancy Agreement.pdf", date: "Aug 1, 2023", size: "2.4 MB" },
            { id: 2, name: "Deposit Receipt.pdf", date: "Aug 1, 2023", size: "890 KB" },
            { id: 3, name: "Insurance Certificate.pdf", date: "Sep 15, 2023", size: "1.2 MB" },
        ],
        activity: [
            { id: 1, type: "payment", title: "Rent Payment", description: "€1,450 received", date: "Mar 1, 2026", icon: "check" },
            { id: 2, type: "message", title: "Message from Landlord", description: "Quarterly inspection scheduled", date: "Feb 28, 2026", icon: "message" },
            { id: 3, type: "payment", title: "Rent Payment", description: "€1,450 received", date: "Feb 1, 2026", icon: "check" },
            { id: 4, type: "document", title: "New Document", description: "Insurance renewal required", date: "Jan 25, 2026", icon: "file" },
        ],
    },
};

export default function TenantDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const tenantId = parseInt(params.id) || 1;

    const tenant = TENANT_DATA[tenantId] || TENANT_DATA[1];
    const [activeTab, setActiveTab] = useState("overview");
    const [showMenu, setShowMenu] = useState(false);

    const statuses = {
        Let: { color: "bg-teal-100 text-teal-800", label: "Active Tenancy" },
        Notice: { color: "bg-orange-100 text-orange-800", label: "Notice Served" },
        Ended: { color: "bg-slate-100 text-slate-600", label: "Tenancy Ended" },
    };

    const tabs = ["overview", "documents", "activity"];

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        console.log("TODO: Download tenant document");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${tenant.name} - Tenant Details`,
                text: `View tenant information for ${tenant.name}`,
            });
        } else {
            console.log("TODO: Copy link to clipboard");
        }
    };

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
                    <h1 className="text-3xl font-bold text-slate-900">{tenant.name}</h1>
                    <p className="text-sm text-slate-500 mt-1">{tenant.property} • {tenant.county}</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label="Menu"
                    >
                        <MoreVertical size={20} className="text-slate-600" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                            <button
                                onClick={handleDownload}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                            >
                                <Download size={16} /> Download Details
                            </button>
                            <button
                                onClick={handlePrint}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition border-t border-slate-100"
                            >
                                <FileText size={16} /> Print
                            </button>
                            <button
                                onClick={handleShare}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition border-t border-slate-100"
                            >
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Status badge and quick info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Status</p>
                    <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 ${statuses[tenant.status]?.color}`}>
                        {statuses[tenant.status]?.label}
                    </span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Monthly Rent</p>
                    <p className="text-xl font-bold text-slate-900">{tenant.rent}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Last Payment</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.lastPayment}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Next Due</p>
                    <p className="text-sm font-semibold text-teal-600">{tenant.nextDueDate}</p>
                </div>
            </div>

            {/* Tab navigation */}
            <div className="border-b border-slate-200 mb-6">
                <div className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-1 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab
                                    ? "border-teal-600 text-teal-600"
                                    : "border-transparent text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</p>
                                    <p className="text-base font-semibold text-slate-900">{tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Date of Birth</p>
                                    <p className="text-base text-slate-700 flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" /> {tenant.dob}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">P.P.S. Number</p>
                                    <p className="text-base font-mono text-slate-700">{tenant.pps}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Mobile</p>
                                    <p className="text-base text-slate-700 flex items-center gap-2">
                                        <Phone size={16} className="text-slate-400" /> {tenant.mobile}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Email Address</p>
                                <p className="text-base text-slate-700 flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" /> {tenant.email}
                                </p>
                            </div>
                        </div>

                        {/* Tenancy Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tenancy Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property</p>
                                        <p className="text-base font-semibold text-slate-900">{tenant.property}</p>
                                    </div>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        <MapPin size={18} className="text-teal-600" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Start Date</p>
                                        <p className="text-base text-slate-700">{tenant.startDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">End Date</p>
                                        <p className="text-base text-slate-700">{tenant.endDate}</p>
                                    </div>
                                </div>

                                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Monthly Rent</p>
                                            <p className="text-lg font-bold text-teal-700">{tenant.rent}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Due Day</p>
                                            <p className="text-lg font-bold text-teal-700">{tenant.rentDueDay}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Status</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <CheckCircle2 size={16} className="text-teal-600" />
                                                <span className="text-sm font-semibold text-teal-700">Paid</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Contact Card */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border border-teal-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 rounded-full ${tenant.color} flex items-center justify-center text-white text-lg font-bold`}>
                                    {tenant.initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{tenant.name}</p>
                                    <p className="text-xs text-slate-600">{tenant.county}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`mailto:${tenant.email}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    aria-label="Send email"
                                >
                                    <Mail size={18} className="text-teal-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{tenant.email}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                                </a>

                                <a
                                    href={`tel:${tenant.mobile}`}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    aria-label="Call tenant"
                                >
                                    <Phone size={18} className="text-teal-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-500">Mobile</p>
                                        <p className="text-sm font-semibold text-slate-700">{tenant.mobile}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                                </a>
                            </div>

                            <button className="w-full mt-4 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                                <MessageSquare size={16} /> Send Message
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
                            <button className="w-full px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <Eye size={16} /> View Property
                            </button>
                            <button className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-500">
                                <Edit size={16} /> Request Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Documents</h2>
                    <div className="space-y-3">
                        {tenant.documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 transition group"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-teal-100 transition">
                                        <FileText size={20} className="text-slate-600 group-hover:text-teal-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">{doc.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-xs text-slate-500">{doc.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="p-2 hover:bg-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500 ml-2 flex-shrink-0"
                                    aria-label={`Download ${doc.name}`}
                                >
                                    <Download size={18} className="text-teal-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Activity</h2>
                    <div className="space-y-4">
                        {tenant.activity.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex gap-4 pb-4 last:pb-0"
                                style={{ borderBottom: index < tenant.activity.length - 1 ? "1px solid #e2e8f0" : "none" }}
                            >
                                <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === "payment"
                                            ? "bg-teal-100"
                                            : item.type === "message"
                                                ? "bg-blue-100"
                                                : "bg-slate-100"
                                        }`}>
                                        {item.type === "payment" && <CheckCircle2 size={18} className="text-teal-600" />}
                                        {item.type === "message" && <MessageSquare size={18} className="text-blue-600" />}
                                        {item.type === "document" && <FileText size={18} className="text-slate-600" />}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                    <p className="text-sm text-slate-600">{item.description}</p>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Clock size={12} /> {item.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PortalShell>
    );
}
