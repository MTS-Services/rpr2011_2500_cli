"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddTenancyModal({ isOpen, onClose, onSubmit, properties }) {
    const [formData, setFormData] = useState({
        property: "",
        status: "",
        startDate: "",
        endDate: "",
        rent: "",
        rentDueDay: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.property || !formData.status || !formData.rent || !formData.rentDueDay) {
            alert("Please fill in all required fields");
            return;
        }
        onSubmit(formData);
        setFormData({
            property: "",
            status: "",
            startDate: "",
            endDate: "",
            rent: "",
            rentDueDay: "",
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
                        <h3 className="text-xl font-semibold text-slate-800">Add New Tenancy</h3>
                        <p className="text-base text-slate-500 mt-1">Fill in the tenancy details below</p>
                    </div>
                    <button aria-label="Close" onClick={onClose} className="text-slate-500 hover:text-slate-700 flex-shrink-0">
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form id="addTenancyForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {/* Property */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Property <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="property"
                            value={formData.property}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="">Select a property</option>
                            <option value="Apt 12, Grand Canal...">Apt 12, Grand Canal...</option>
                            <option value="Apt 5B, Rosewood Close">Apt 5B, Rosewood Close</option>
                            <option value="Apt 4, Lis Na Dara">Apt 4, Lis Na Dara</option>
                            <option value="Apt 21C, Harbour View">Apt 21C, Harbour View</option>
                            <option value="Apt 65, Southern Cross">Apt 65, Southern Cross</option>
                            <option value="Apt 306, Fairview Road">Apt 306, Fairview Road</option>
                            <option value="Apt 7D, Hanover Quay">Apt 7D, Hanover Quay</option>
                            <option value="Apt 104, Elmwood Grove">Apt 104, Elmwood Grove</option>
                            <option value="Apt 5, City Square">Apt 5, City Square</option>
                            <option value="Apt 399, Pearse Street">Apt 399, Pearse Street</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="">Select a status</option>
                            <option value="Let">Let</option>
                            <option value="Notice">Notice</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>

                    {/* Start Date & End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Rent & Rent Due Day */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">
                                Rent <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="rent"
                                value={formData.rent}
                                onChange={handleFormChange}
                                placeholder="e.g., €2,200"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">
                                Rent Due Day <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="rentDueDay"
                                value={formData.rentDueDay}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            >
                                <option value="">Select day</option>
                                <option value="1">1st</option>
                                <option value="5">5th</option>
                                <option value="10">10th</option>
                                <option value="15">15th</option>
                                <option value="20">20th</option>
                                <option value="25">25th</option>
                                <option value="28">28th</option>
                                <option value="30">30th</option>
                            </select>
                        </div>
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
                        form="addTenancyForm"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
                    >
                        Add Tenancy
                    </button>
                </div>
            </div>
        </div>
    );
}
