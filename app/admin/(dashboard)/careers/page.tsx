"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Plus, Edit2, Trash2, Loader2, X, Save } from "lucide-react";
import { fetchJsonCached } from "@/lib/clientFetch";

interface Job {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  requirements: string[];
  active: boolean;
}

interface FormData {
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  requirements: string[];
  active: boolean;
}

export default function CareersPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({ title: '', department: '', location: '', type: 'Full-time', level: 'Middle', salary: '', description: '', requirements: [], active: true });
  const [requirementInput, setRequirementInput] = useState('');
  const hasFetched = React.useRef(false);

  const showToast = (type: 'success' | 'error', message: string) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

  const fetchJobs = async () => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        "/api/admin/careers"
      );
      if (result.success) setJobs(result.data.jobs);
    } catch (error) { console.error('Failed:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchJobs();
  }, [router]);

  const openModal = (type: 'add' | 'edit', job?: Job) => {
    setModalType(type);
    setSelectedJob(job || null);
    const newFormData: FormData = job 
      ? { 
          title: job.title, 
          department: job.department, 
          location: job.location, 
          type: job.type, 
          level: job.level, 
          salary: job.salary, 
          description: job.description, 
          requirements: job.requirements || [], 
          active: job.active 
        }
      : { 
          title: '', 
          department: '', 
          location: '', 
          type: 'Full-time', 
          level: 'Middle', 
          salary: '', 
          description: '', 
          requirements: [], 
          active: true 
        };
    setFormData(newFormData);
    setRequirementInput('');
    setModalOpen(true);
  };

  const addRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== reqToRemove)
    }));
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    try {
      const method = modalType === 'add' ? 'POST' : 'PUT';
      const body = modalType === 'edit' ? { id: selectedJob?.id, ...formData } : formData;
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        "/api/admin/careers",
        { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );
      if (result.success) { showToast('success', modalType === 'add' ? 'Đã tạo vị trí' : 'Đã cập nhật'); fetchJobs(); setModalOpen(false); }
      else showToast('error', result.error);
    } catch { showToast('error', 'Có lỗi xảy ra'); }
    finally { setActionLoading(false); }
  };

  const toggleActive = async (id: number, active: boolean) => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        "/api/admin/careers",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, active: !active }),
        }
      );
      if (result.success) { showToast('success', 'Đã cập nhật'); fetchJobs(); }
    } catch { showToast('error', 'Có lỗi xảy ra'); }
  };

  const deleteJob = async (id: number) => {
    if (!confirm('Xóa vị trí này?')) return;
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        `/api/admin/careers?id=${id}`,
        { method: "DELETE" }
      );
      if (result.success) { showToast('success', 'Đã xóa vị trí'); fetchJobs(); }
    } catch { showToast('error', 'Có lỗi xảy ra'); }
  };

  return (
    <>
      {toast && <div className={`fixed top-4 right-4 z-100 px-6 py-1 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-green-400' : 'bg-red-600'} text-white font-medium`}>{toast.message}</div>}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Quản lý Tuyển dụng ({jobs.length} vị trí)</h3>
            </div>
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg cursor-pointer">
              <Plus className="w-4 h-4" /> Thêm vị trí
            </button>
          </div>
          
          <div className="p-6">
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${job.active ? "bg-green-500" : "bg-slate-500"}`} />
                      <div>
                        <p className="text-white font-medium">{job.title}</p>
                        <p className="text-slate-400 text-sm">{job.department} • {job.location} • {job.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(job.id, job.active)} className={`px-3 py-1 rounded-lg text-sm cursor-pointer ${job.active ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                        {job.active ? "Đang tuyển" : "Đã đóng"}
                      </button>
                      <button onClick={() => openModal('edit', job)} className="p-2 hover:bg-blue-500/20 rounded-lg text-slate-400 hover:text-blue-400 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteJob(job.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12"><Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">Chưa có vị trí tuyển dụng</p></div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
              <h3 className="font-semibold text-white">{modalType === 'add' ? 'Thêm vị trí' : 'Chỉnh sửa vị trí'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Tên vị trí</label><input type="text" placeholder="VD: Senior Frontend Developer" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Phòng ban</label><select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"><option value="">Chọn phòng ban</option><option value="Engineering">Engineering</option><option value="Product">Product</option><option value="Design">Design</option><option value="Sales">Sales</option><option value="Marketing">Marketing</option><option value="HR">HR</option></select></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Địa điểm</label><input type="text" placeholder="VD: Hà Nội" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Loại hình</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option><option value="Remote">Remote</option></select></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Cấp độ</label><select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"><option value="Intern">Intern</option><option value="Junior">Junior</option><option value="Middle">Middle</option><option value="Senior">Senior</option><option value="Lead">Lead</option><option value="Manager">Manager</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Mức lương</label><input type="text" placeholder="VD: 20-35 triệu VND" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Mô tả công việc</label><textarea placeholder="Mô tả chi tiết về vị trí..." rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none" /></div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Yêu cầu ứng viên</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập yêu cầu và nhấn Enter"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequirement();
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={addRequirement}
                      type="button"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                  {formData.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                        >
                          {req}
                          <button
                            onClick={() => removeRequirement(req)}
                            type="button"
                            className="hover:text-blue-300 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="w-4 h-4" /><label htmlFor="active" className="text-slate-300">Đang tuyển dụng</label></div>
              <button onClick={handleSubmit} disabled={actionLoading || !formData.title} className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}<Save className="w-4 h-4" /> {modalType === 'add' ? 'Tạo vị trí' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
