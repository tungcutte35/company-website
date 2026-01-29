"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, Search, Loader2, X, Save } from "lucide-react";
import { fetchJsonCached } from "@/lib/clientFetch";

interface Subscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const hasFetched = React.useRef(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSubscribers = async () => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any }>(
        "/api/admin/newsletter"
      );
      if (result.success) setSubscribers(result.data.subscribers);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchSubscribers();
  }, []);

  const addSubscriber = async () => {
    if (!newEmail) return;
    setActionLoading(true);
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        "/api/admin/newsletter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newEmail }),
        }
      );
      if (result.success) { showToast('success', 'Đã thêm subscriber'); fetchSubscribers(); setModalOpen(false); setNewEmail(""); }
      else showToast('error', result.error || 'Có lỗi xảy ra');
    } catch { showToast('error', 'Có lỗi xảy ra'); }
    finally { setActionLoading(false); }
  };

  const toggleStatus = async (email: string, active: boolean) => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        "/api/admin/newsletter",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, active: !active }),
        }
      );
      if (result.success) { showToast('success', 'Đã cập nhật'); fetchSubscribers(); }
    } catch { showToast('error', 'Có lỗi xảy ra'); }
  };

  const deleteSubscriber = async (email: string) => {
    if (!confirm(`Xóa subscriber ${email}?`)) return;
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        `/api/admin/newsletter?email=${email}`,
        { method: "DELETE" }
      );
      if (result.success) { showToast('success', 'Đã xóa'); fetchSubscribers(); }
    } catch { showToast('error', 'Có lỗi xảy ra'); }
  };

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {toast && <div className={`fixed top-4 right-4 z-100 px-6 py-1 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-green-400' : 'bg-red-600'} text-white font-medium`}>{toast.message}</div>}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Newsletter Subscribers ({subscribers.length})</h3>
            </div>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg cursor-pointer">
              <Plus className="w-4 h-4" /> Thêm
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Tìm kiếm email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white block">{sub.email}</span>
                        <span className="text-xs text-slate-500">{new Date(sub.subscribedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(sub.email, sub.active)} className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${sub.active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                        {sub.active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => deleteSubscriber(sub.email)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Chưa có subscribers</p>
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-semibold text-white">Thêm Subscriber</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <button onClick={addSubscriber} disabled={actionLoading || !newEmail} className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" /> Thêm Subscriber
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
