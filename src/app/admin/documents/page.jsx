"use client";
import { useState, useEffect } from "react";
import {
  Plus, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, Download, FileText
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";

const DOCUMENTS = [
  { id: 1,  icon: "teal",   name: "Kevin Madden signed lease.pdf",          sub: "Apt 5B, Rosewood Close",  type: "Lease",      typeStyle: "bg-teal-100 text-teal-700",    property: "Apt 5B,\nRosewood Close",       visibility: ["Tenant", "Landlord", "Lease"],  uploader: "John McCann",  age: "1 hour ago" },
  { id: 2,  icon: "teal",   name: "Apt 104, Elmwood Grove",                 sub: "Dublin · 10:6x20",       type: "Invoice",     typeStyle: "bg-teal-100 text-teal-700",    property: "Joan Doyle\nDublin · 04.60",     visibility: ["Tenant", "Landlord", "Lease"],  uploader: "Emma Curran",  age: "1 day ago" },
  { id: 3,  icon: "teal",   name: "Rent Invoice - August 2022.pdf",         sub: "Apt 21C, Harbour View",  type: "Invoice",     typeStyle: "bg-teal-100 text-teal-700",    property: "Regaind Spencer\nDublin · 10.631", visibility: ["Tenant", "Landlord", "Lease"], uploader: "Sarah Kelly",  age: "2 days ago" },
  { id: 4,  icon: "teal",   name: "Rent Statement - July 2022.pdf",         sub: "Apt 12, Grand Canal Dock", type: "Statement", typeStyle: "bg-indigo-100 text-indigo-700", property: "Edward O'Neill\nDublin · 10.451", visibility: ["Tenant", "Landlord", "Lease"],  uploader: "Mark Sheehan", age: "2 days ago" },
  { id: 5,  icon: "teal",   name: "Rent Statement - July 2022.pdf",         sub: "Apt 12, Grand Canal Dock", type: "Statement", typeStyle: "bg-indigo-100 text-indigo-700", property: "Edward O'Neill\nDublin · 10.255", visibility: [],                               uploader: "Mark Sheehan", age: "3 days ago" },
  { id: 6,  icon: "teal",   name: "Section 19 Letter - Apt 70.pdf",         sub: "Apt 70, City Square",    type: "Invoice",     typeStyle: "bg-teal-100 text-teal-700",    property: "Apt 70, City Square\nDublin · 10.355", visibility: ["Landlord"],              uploader: "John McCann",  age: "2 months ago" },
  { id: 7,  icon: "teal",   name: "Property Photos - Apt 306 Fairview Road.pdf", sub: "Mark Sheehan · 4 months", type: null,      typeStyle: "",                             property: "Apt 306, Fairview Road\nDublin · 10.310", visibility: ["Landlord"],           uploader: "Mark Sheehan", age: "4 months ago" },
  { id: 8,  icon: "teal",   name: "Final Rent Statement.pdf",               sub: "Apt 21C, Harbour View",  type: "Statement",   typeStyle: "bg-indigo-100 text-indigo-700", property: "Regaind Spencer\nDublin · 10.255", visibility: ["Lençting", "Landlord"],         uploader: "Emma Curran",  age: "3 months ago" },
  { id: 9,  icon: "amber",  name: "Section 19 Letter - Apt 70.pdf",         sub: "John McCann",            type: "Statement",   typeStyle: "bg-indigo-100 text-indigo-700", property: "Edward O'Neill\nDublin · 10.153", visibility: ["Landlord", "Landlord"],         uploader: "Emma Curran",  age: "5 months ago" },
  { id: 10, icon: "teal",   name: "Final Rent Statement.pdf",               sub: "Apt 21C, Harbour View",  type: "Statement",   typeStyle: "bg-indigo-100 text-indigo-700", property: "Apt 216, Fairview Road\nDublin · 10.539", visibility: ["Apt 0i, Oneill"],     uploader: "Emma Curran",  age: "5 months ago" },
];

const VIS_STYLE = {
  Tenant:   "bg-teal-100 text-teal-700",
  Landlord: "bg-amber-100 text-amber-700",
  Lease:    "bg-teal-50 text-teal-600 border border-teal-200",
  Lençting: "bg-teal-100 text-teal-700",
  "Apt 0i, Oneill": "bg-slate-100 text-slate-600",
};

export default function AdminDocumentsPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [visPopoverId, setVisPopoverId] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [tenancyFilter, setTenancyFilter] = useState("All Tenancies");
  const [docs, setDocs] = useState(DOCUMENTS);

  const filtered = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.property.toLowerCase().includes(search.toLowerCase())
  ).filter((d) => (propertyFilter === "All Properties" ? true : d.property.includes(propertyFilter)))
    .filter((d) => (tenancyFilter === "All Tenancies" ? true : d.sub.includes(tenancyFilter)))
    .filter((d) => (typeFilter === 'All' ? true : d.type === typeFilter));

  const uniqueProperties = Array.from(new Set(docs.map((d) => d.property.split("\n")[0]))).slice(0, 20);
  const uniqueTenancies = Array.from(new Set(docs.map((d) => d.sub))).slice(0, 20);
  

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

  const handleDownload = (doc) => {
    const content = `Mock file content for: ${doc.name}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name.replace(/\s+/g, "_");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportSelected = () => {
    const rows = docs.filter((d) => selected.includes(d.id));
    if (rows.length === 0) {
      alert('No rows selected to export');
      return;
    }
    const header = ['Name','Type','Property','Uploaded By','Age'];
    const csv = [header.join(',')].concat(
      rows.map(r => [r.name, r.type || '', r.property.replace(/\n/g,' '), r.uploader, r.age].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documents_export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const deleteSelected = () => {
    if (selected.length === 0) {
      alert('No rows selected to delete');
      return;
    }
    if (!confirm(`Delete ${selected.length} selected document(s)? This is a client-side mock.`)) {
      return;
    }
    setDocs((d) => d.filter(x => !selected.includes(x.id)));
    setSelected([]);
  };

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((d) => d.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
        <div className="flex items-center gap-2">
          <button onClick={openUpload} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Plus size={15} /> <span className="hidden sm:inline">Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option>All Properties</option>
          {uniqueProperties.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select value={tenancyFilter} onChange={(e) => setTenancyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option>All Tenancies</option>
          {uniqueTenancies.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-36">
          <option value="All">All Types</option>
          <option value="Lease">Lease</option>
          <option value="Invoice">Invoice</option>
          <option value="Statement">Statement</option>
        </select>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-36"
          />
        </div>
        {/* visibility select removed as requested */}
        <div className="flex-1" />
            <button onClick={openUpload} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition">
          <Plus size={13} /> New
        </button>
        {/* actions select removed as requested */}
      </div>

      {/* Upload modal (mock) */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeUpload} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Upload Document</h3>
                <p className="text-sm text-slate-500 mt-1">This is a mock upload form (client-side).</p>
              </div>
              <button aria-label="Close" onClick={closeUpload} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // client-side mock: add doc entry
                const newId = Math.max(0, ...docs.map((d) => d.id)) + 1;
                const type = e.target.elements[1]?.value || "Lease";
                const name = uploadFile ? uploadFile.name : `Document ${newId}`;
                const newDoc = {
                  id: newId,
                  icon: "teal",
                  name,
                  sub: propertyFilter === "All Properties" ? "Unknown" : propertyFilter,
                  type: type,
                  typeStyle: type === "Statement" ? "bg-indigo-100 text-indigo-700" : "bg-teal-100 text-teal-700",
                  property: propertyFilter === "All Properties" ? "Unknown" : propertyFilter,
                  visibility: ["Tenant"],
                  uploader: "You",
                  age: "just now",
                };
                setDocs((d) => [newDoc, ...d]);
                closeUpload();
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-sm text-slate-600 mb-1">File</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-2','ring-teal-300'); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('ring-2','ring-teal-300'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('ring-2','ring-teal-300');
                    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
                    if (f) {
                      // enforce PDF only
                      if (f.type !== 'application/pdf') {
                        alert('Please upload a PDF file');
                        return;
                      }
                      // reuse onFileChange logic
                      const fakeEvent = { target: { files: [f] } };
                      onFileChange(fakeEvent);
                    }
                  }}
                  className="border-dashed border-2 border-slate-200 rounded-lg p-6 text-center bg-white cursor-pointer"
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
                    {/* <div className="text-sm text-slate-500 truncate max-w-full">{uploadFile ? uploadFile.name : 'No file chosen'}</div> */}
                  </div>
                </div>
              </div>

              {uploadFile && (
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                  {previewType === "image" && previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-60 w-auto mx-auto rounded-md object-contain" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-teal-600" />
                      <div>
                        <p className="font-medium text-slate-800">{uploadFile.name}</p>
                        <p className="text-sm text-slate-500">{Math.round(uploadFile.size / 1024)} KB • {uploadFile.type || 'Unknown'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option>Lease</option>
                  <option>Invoice</option>
                  <option>Statement</option>
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end mt-4">
                <button type="button" onClick={closeUpload} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.icon === "amber" ? "bg-amber-100" : "bg-teal-100"}`}>
                <FileText size={16} className={doc.icon === "amber" ? "text-amber-600" : "text-teal-600"} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm truncate">{doc.name}</p>
                <p className="text-xs text-slate-400 truncate">{doc.sub}</p>
              </div>
              {doc.type && (
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold flex-shrink-0 ${doc.typeStyle}`}>{doc.type}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Property</p>
                <p className="font-medium text-slate-700 text-xs">{doc.property.replace("\n", " ")}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Uploaded By</p>
                <p className="font-medium text-slate-700 text-xs">{doc.uploader}</p>
              </div>
            </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{doc.age}</span>
                <button onClick={() => handleDownload(doc)} className="h-8 px-3 inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-md transition text-xs font-medium border border-teal-200">
                  <Download size={12} /> Download
                </button>
              </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">File Name <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Type <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Property <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Visibility</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Uploaded By</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Uploaded</th>
              <th className="w-20 px-3 py-3 text-right font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((doc) => (
              <tr key={doc.id} className={`hover:bg-slate-50/60 transition ${selected.includes(doc.id) ? "bg-teal-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggleRow(doc.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.icon === "amber" ? "bg-amber-100" : "bg-teal-100"}`}>
                      <FileText size={15} className={doc.icon === "amber" ? "text-amber-600" : "text-teal-600"} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{doc.name}</p>
                      <p className="text-sm text-slate-400">{doc.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {doc.type && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-semibold ${doc.typeStyle}`}>
                      <FileText size={11} />
                      {doc.type}
                    </span>
                  )}
                  {!doc.type && doc.visibility.includes("Landlord") && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-semibold bg-amber-100 text-amber-700">
                      Landlord
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {doc.property.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm ${i === 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>{line}</p>
                  ))}
                </td>
                <td className="px-3 py-3 relative">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const items = doc.visibility || [];
                      if (items.length === 0) return null;
                      if (items.length === 1) {
                        const v = items[0];
                        return (
                          <span className={`px-2 py-0.5 rounded-md text-sm font-medium ${VIS_STYLE[v] || "bg-slate-100 text-slate-600"}`}>{v}</span>
                        );
                      }
                      const count = items.length;
                      return (
                        <>
                          <button
                            onClick={() => setVisPopoverId(visPopoverId === doc.id ? null : doc.id)}
                            aria-expanded={visPopoverId === doc.id}
                            className="px-2 py-0.5 rounded-md text-sm font-medium bg-slate-100 text-slate-600"
                          >
                            {count}+ 
                          </button>
                          {visPopoverId === doc.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setVisPopoverId(null)} />
                              <div className="absolute right-0 top-full mt-2 z-50 w-44 bg-white border border-slate-200 rounded-md shadow-lg p-3">
                                <div className="flex flex-col gap-2">
                                  {items.map((v, idx) => (
                                    <span key={idx} className={`px-2 py-1 rounded-md text-sm font-medium ${VIS_STYLE[v] || "bg-slate-100 text-slate-600"}`}>{v}</span>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-700 text-sm font-medium">{doc.uploader}</td>
                <td className="px-3 py-3 text-slate-400 text-sm">{doc.age}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDownload(doc)} className="w-7 h-7 flex items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-md transition border border-teal-200">
                      <Download size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>
    </div>
  );
}
