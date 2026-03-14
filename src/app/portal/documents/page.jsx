"use client";

import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Download, Search, ChevronDown, FileText, File, Plus } from "lucide-react";

const docs = [
  { property: "Apt 5B Rosewood Close", name: "Lease Agreement 2022.pdf", type: "Lease", date: "Oct 10, 2022", size: "248 KB" },
  { property: "Apt 306 Fairview Rd", name: "RTB Registration Cert.pdf", type: "RTB Registration", date: "May 19, 2023", size: "134 KB" },
  { property: "Apt 104 Elmwood Grove", name: "March 2024 Rent Statement.pdf", type: "Statement", date: "Apr 1, 2024", size: "89 KB" },
  { property: "Apt 22 Parkside Plaza", name: "Annual Inspection Report.pdf", type: "Inspection", date: "Jan 15, 2024", size: "320 KB" },
  { property: "Apt 5B Rosewood Close", name: "Plumbing Invoice #0042.pdf", type: "Invoice", date: "Feb 28, 2024", size: "72 KB" },
  { property: "Apt 104 Elmwood Grove", name: "Lease Agreement 2023.pdf", type: "Lease", date: "Aug 3, 2023", size: "261 KB" },
];

const typeColors = {
  Lease: "bg-blue-50 text-blue-700",
  "RTB Registration": "bg-purple-50 text-purple-700",
  Statement: "bg-teal-50 text-teal-700",
  Inspection: "bg-amber-50 text-amber-700",
  Invoice: "bg-rose-50 text-rose-700",
};

export default function DocumentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [allDocs, setAllDocs] = useState(docs);

  const openUpload = () => setUploadOpen(true);
  const closeUpload = () => {
    setUploadOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadFile(null);
    setPreviewUrl(null);
    setPreviewType(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setUploadFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }
    setUploadFile(f);
    const isImage = f.type && f.type.startsWith("image/");
    if (isImage) {
      const url = URL.createObjectURL(f);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setPreviewType("image");
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPreviewType("file");
    }
  };

  return (
    <PortalShell>
      <div className="mb-3 lg:mb-5 flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Documents</h1>
        <button 
          onClick={openUpload}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus size={16} /> <span className="hidden sm:inline">Upload Document</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3 mb-2 lg:mb-4">
        {["All Properties", "All Document Types"].map((f) => (
          <button key={f} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition shadow-sm">
            {f} <ChevronDown size={15} />
          </button>
        ))}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {allDocs.map((d, i) => (
            <div key={i} className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{d.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.property}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${typeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{d.date}</span>
                <span>{d.size}</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Document</th>
                <th className="text-left px-5 py-4">Property</th>
                <th className="text-left px-5 py-4">Type</th>
                <th className="text-left px-5 py-4">Date</th>
                <th className="text-left px-5 py-4">Size</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allDocs.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-slate-500" />
                      </div>
                      <span className="text-base font-semibold text-slate-700 truncate max-w-[240px]">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-600">{d.property}</td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${typeColors[d.type] || "bg-slate-100 text-slate-600"}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-500">{d.date}</td>
                  <td className="px-5 py-5 text-base text-slate-400">{d.size}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#f0fdfa] text-gray-800 rounded-lg transition">
                      <Download size={16} /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          total={allDocs.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeUpload} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Upload Document</h3>
                <p className="text-sm text-slate-500 mt-1">Upload documents for your properties.</p>
              </div>
              <button aria-label="Close" onClick={closeUpload} className="text-slate-500 hover:text-slate-700 text-lg">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!uploadFile) {
                  alert('Please select a file');
                  return;
                }
                const type = e.target.elements[1]?.value || "Lease";
                const propertySelect = e.target.elements[2]?.value || "Apt 5B Rosewood Close";
                const name = uploadFile.name;
                const newDoc = {
                  property: propertySelect,
                  name,
                  type,
                  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                  size: Math.round(uploadFile.size / 1024) + " KB"
                };
                setAllDocs((d) => [newDoc, ...d]);
                closeUpload();
                alert('Document uploaded successfully (client-side mock)');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-2','ring-teal-300'); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('ring-2','ring-teal-300'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('ring-2','ring-teal-300');
                    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
                    if (f) {
                      if (f.type !== 'application/pdf') {
                        alert('Please upload a PDF file');
                        return;
                      }
                      const fakeEvent = { target: { files: [f] } };
                      onFileChange(fakeEvent);
                    }
                  }}
                  className="border-dashed border-2 border-slate-200 rounded-lg p-6 text-center bg-white cursor-pointer hover:border-teal-300 transition"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-full">
                      <input
                        type="file"
                        accept="application/pdf"
                        required
                        onChange={onFileChange}
                        className="hidden"
                        id="doc-file-input"
                      />
                      <label htmlFor="doc-file-input" className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-700 cursor-pointer hover:bg-slate-50">
                        Browse Files
                      </label>
                    </div>
                    <div className="text-xs text-slate-400">OR</div>
                    <div className="text-sm text-slate-500">Drag & Drop Files Here</div>
                  </div>
                </div>
              </div>

              {uploadFile && (
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-teal-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">{uploadFile.name}</p>
                      <p className="text-sm text-slate-500">{Math.round(uploadFile.size / 1024)} KB</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Lease</option>
                  <option>RTB Registration</option>
                  <option>Statement</option>
                  <option>Inspection</option>
                  <option>Invoice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Apt 5B Rosewood Close</option>
                  <option>Apt 306 Fairview Rd</option>
                  <option>Apt 104 Elmwood Grove</option>
                  <option>Apt 22 Parkside Plaza</option>
                </select>
              </div>

              <div className="flex items-center gap-3 justify-end pt-2">
                <button type="button" onClick={closeUpload} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
