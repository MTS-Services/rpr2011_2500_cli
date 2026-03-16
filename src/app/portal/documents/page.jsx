"use client";

import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Download, Search, ChevronDown, FileText, File, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { authenticatedFetch } from "@/utils/authFetch";

// Type styling
const TYPE_STYLE = {
  LEASE: { label: "Lease", style: "bg-blue-50 text-blue-700" },
  INVOICE: { label: "Invoice", style: "bg-rose-50 text-rose-700" },
  STATEMENT: { label: "Statement", style: "bg-teal-50 text-teal-700" },
};

// Calculate relative time
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// Format file size
function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Transform API response to UI format
function transformDocument(apiDoc) {
  const typeUpper = (apiDoc.type || "").toUpperCase();
  const typeInfo = TYPE_STYLE[typeUpper] || { label: apiDoc.type || "Unknown", style: "bg-slate-100 text-slate-600" };

  return {
    id: apiDoc.id,
    property: apiDoc.property?.name || "Unknown",
    name: apiDoc.name,
    type: typeInfo.label,
    typeStyle: typeInfo.style,
    date: getRelativeTime(apiDoc.createdAt),
    size: formatFileSize(apiDoc.fileSize),
    fileUrl: apiDoc.fileUrl,
    createdAt: apiDoc.createdAt,
  };
}

export default function DocumentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          const transformed = data.data.map(doc => transformDocument(doc));
          setAllDocs(transformed);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(err.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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

  const handleDownload = async (doc) => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/${doc.id}/download`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = doc.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error downloading document:", err);
      Swal.fire("Error", err.message || "Failed to download document", "error");
    }
  };

  const handleDeleteDocument = async (doc) => {
    const result = await Swal.fire({
      title: "Delete Document?",
      text: `Are you sure you want to delete "${doc.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/${doc.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      setAllDocs((prevDocs) => prevDocs.filter((d) => d.id !== doc.id));
      Swal.fire({icon: "success", title: "Deleted!", timer: 2000, showConfirmButton: false});
    } catch (err) {
      console.error("Error deleting document:", err);
      Swal.fire("Error", err.message || "Failed to delete document", "error");
    }
  };

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

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-slate-600">Loading documents...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {/* No Documents State */}
      {!loading && !error && allDocs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No documents found.</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && allDocs.length > 0 && (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {allDocs.map((d) => (
            <div key={d.id} className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{d.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.property}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${d.typeStyle}`}>{d.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{d.date}</span>
                <span>{d.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDownload(d)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                  <Download size={13} /> Download
                </button>
                <button onClick={() => handleDeleteDocument(d)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
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
              {allDocs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
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
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${d.typeStyle}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-500">{d.date}</td>
                  <td className="px-5 py-5 text-base text-slate-400">{d.size}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDownload(d)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                        <Download size={16} /> Download
                      </button>
                      <button onClick={() => handleDeleteDocument(d)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
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
      )}

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
