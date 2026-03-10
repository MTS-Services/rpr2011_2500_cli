"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddPropertyModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    county: "",
    eircode: "",
    landlord: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.landlord) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      type: "",
      bedrooms: "",
      bathrooms: "",
      address: "",
      county: "",
      eircode: "",
      landlord: "",
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
            <h3 className="text-xl font-semibold text-slate-800">Add New Property</h3>
            <p className="text-sm text-slate-500 mt-1">Fill in the property details below</p>
          </div>
          <button aria-label="Close" onClick={onClose} className="text-slate-500 hover:text-slate-700 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form id="addPropertyForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., Apt 12, Grand Canal..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="townhouse">Townhouse</option>
              <option value="studio">Studio</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleFormChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleFormChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Street address"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* County/City & Eircode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">County/City</label>
              <input
                type="text"
                name="county"
                value={formData.county}
                onChange={handleFormChange}
                placeholder="e.g., Dublin"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Eircode</label>
              <input
                type="text"
                name="eircode"
                value={formData.eircode}
                onChange={handleFormChange}
                placeholder="e.g., D01 1AA"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Assigned Landlord */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assigned Landlord <span className="text-red-500">*</span>
            </label>
            <select
              name="landlord"
              value={formData.landlord}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a landlord</option>
              <option value="Edward O'Neill">Edward O'Neill</option>
              <option value="Joan Doyle">Joan Doyle</option>
              <option value="Zoe Finnegan">Zoe Finnegan</option>
              <option value="Brendan Walsh">Brendan Walsh</option>
              <option value="Mary Bennett">Mary Bennett</option>
              <option value="Mark Sheehan">Mark Sheehan</option>
              <option value="Tony Brennan">Tony Brennan</option>
            </select>
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
            form="addPropertyForm"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
          >
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
}
