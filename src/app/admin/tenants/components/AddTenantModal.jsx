"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddTenantModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        pps: "",
        email: "",
        mobile: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
            alert("Please fill in all required fields");
            return;
        }
        onSubmit(formData);
        setFormData({
            firstName: "",
            lastName: "",
            dob: "",
            pps: "",
            email: "",
            mobile: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" />
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 flex flex-col max-h-[90vh]">
                {/* Sticky Header */}
                <div className="sticky top-0 flex items-start justify-between p-6 border-b border-slate-200 bg-white rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">Add Tenant</h3>
                        <p className="text-base text-slate-500 mt-1">Fill in the tenant details below</p>
                    </div>
                    <button aria-label="Close" onClick={onClose} className="text-slate-500 hover:text-slate-700 flex-shrink-0">
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form id="addTenantForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
                                placeholder="e.g., Sarah"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormChange}
                                placeholder="e.g., Kelly"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* DOB & PPS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">PPS Number</label>
                            <input
                                type="text"
                                name="pps"
                                value={formData.pps}
                                onChange={handleFormChange}
                                placeholder="e.g., 1234567SA"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono uppercase"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="e.g., sarah.kelly@email.com"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleFormChange}
                            placeholder="e.g., 087-965-6692"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </form>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 flex gap-3 justify-end p-6 border-t border-slate-200 bg-white rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="addTenantForm"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
                    >
                        Add Tenant
                    </button>
                </div>
            </div>
        </div>
    );
}
