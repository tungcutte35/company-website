"use client";

import React, { useState, useEffect } from "react";
import { Mail, Eye, Check, Trash2, Search, Loader2, X } from "lucide-react";
import { fetchJsonCached } from "@/lib/clientFetch";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const hasFetched = React.useRef(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any }>(
        "/api/admin/contact"
      );
      if (result.success) {
        setMessages(result.data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMessages();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        "/api/admin/contact",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, read: true }),
        }
      );
      if (result.success) {
        showToast('success', 'Đã đánh dấu đã đọc');
        fetchMessages();
      }
    } catch { showToast('error', 'Có lỗi xảy ra'); }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Xóa tin nhắn này?')) return;
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        `/api/admin/contact?id=${id}`,
        { method: "DELETE" }
      );
      if (result.success) {
        showToast('success', 'Đã xóa tin nhắn');
        fetchMessages();
        setSelectedMessage(null);
      }
    } catch { showToast('error', 'Có lỗi xảy ra'); }
  };

  const viewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-100 px-6 py-1 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-green-400' : 'bg-red-600'} text-white font-medium`}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Tin nhắn liên hệ ({messages.length})</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
            </div>

            {filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 text-sm border-b border-slate-800">
                      <th className="pb-3 pl-2">Status</th>
                      <th className="pb-3">Họ tên</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Dịch vụ</th>
                      <th className="pb-3">Ngày gửi</th>
                      <th className="pb-3 text-right pr-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((msg) => (
                      <tr key={msg.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-4 pl-2">
                          <span className={`w-3 h-3 rounded-full inline-block ${!msg.read ? "bg-blue-500" : "bg-slate-600"}`} />
                        </td>
                        <td className="py-4 text-white">{msg.name}</td>
                        <td className="py-4 text-slate-400">{msg.email}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg">{msg.service || 'general'}</span>
                        </td>
                        <td className="py-4 text-slate-500">{new Date(msg.createdAt).toLocaleString('vi-VN')}</td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => viewMessage(msg)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white cursor-pointer"><Eye className="w-4 h-4" /></button>
                            {!msg.read && <button onClick={() => markAsRead(msg.id)} className="p-2 hover:bg-green-500/20 rounded-lg text-slate-400 hover:text-green-400 cursor-pointer"><Check className="w-4 h-4" /></button>}
                            <button onClick={() => deleteMessage(msg.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Không có tin nhắn</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedMessage(null)} />
          <div className="relative bg-slate-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-semibold text-white">Chi tiết tin nhắn</h3>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-slate-400 text-sm">Họ tên</p><p className="text-white">{selectedMessage.name}</p></div>
                <div><p className="text-slate-400 text-sm">Email</p><p className="text-white">{selectedMessage.email}</p></div>
                <div><p className="text-slate-400 text-sm">Điện thoại</p><p className="text-white">{selectedMessage.phone || 'N/A'}</p></div>
                <div><p className="text-slate-400 text-sm">Công ty</p><p className="text-white">{selectedMessage.company || 'N/A'}</p></div>
              </div>
              <div><p className="text-slate-400 text-sm mb-2">Nội dung</p><p className="text-white bg-slate-800 rounded-lg p-4">{selectedMessage.message}</p></div>
              <button onClick={() => deleteMessage(selectedMessage.id)} className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg cursor-pointer">Xóa tin nhắn</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
