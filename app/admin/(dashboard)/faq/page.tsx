"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X,
  HelpCircle,
  Filter,
  Loader2
} from "lucide-react";
import { fetchJsonCached } from "@/lib/clientFetch";

// Types
interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

// FAQ Item Component
const FAQItem = ({ 
  faq, 
  onEdit, 
  onDelete 
}: { 
  faq: FAQ; 
  onEdit: (faq: FAQ) => void;
  onDelete: (id: number) => void;
}) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
            {faq.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{faq.answer}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(faq)}
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(faq.id)}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

// FAQ Form Modal
const FAQModal = ({ 
  faq, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  faq: FAQ | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Omit<FAQ, 'id'> & { id?: number }) => void;
}) => {
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: ""
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        category: faq.category,
        question: faq.question,
        answer: faq.answer
      });
    } else {
      setFormData({
        category: "",
        question: "",
        answer: ""
      });
    }
  }, [faq, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ...(faq && { id: faq.id })
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {faq ? 'Chỉnh sửa FAQ' : 'Thêm FAQ mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Danh mục
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="VD: Sản phẩm, Tích hợp, Bảo mật..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Câu hỏi
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Nhập câu hỏi..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Câu trả lời
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Nhập câu trả lời chi tiết..."
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" />
              {faq ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const data = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
        `/api/admin/faq?${params.toString()}`
      );
      
      if (data.success) {
        setFaqs(data.data.faqs);
        if (data.data.categories) {
          setCategories(["all", ...data.data.categories]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [searchTerm, selectedCategory]);

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa FAQ này?')) return;
    
    try {
      const data = await fetchJsonCached<{ success: boolean; message?: string; error?: string; errors?: string[] }>(
        `/api/admin/faq?id=${id}`,
        { method: "DELETE" }
      );
      
      if (data.success) {
        alert('Xóa FAQ thành công!');
        fetchFAQs(); // Refresh list
      } else {
        alert(data.error || 'Có lỗi xảy ra khi xóa FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Có lỗi xảy ra khi xóa FAQ');
    }
  };

  const handleSave = async (faqData: Omit<FAQ, 'id'> & { id?: number }) => {
    try {
      const isEdit = !!faqData.id;
      const url = '/api/admin/faq';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(faqData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        setModalOpen(false);
        setEditingFaq(null);
        fetchFAQs(); // Refresh list
      } else {
        if (data.errors) {
          alert(data.errors.join('\n'));
        } else {
          alert(data.error || 'Có lỗi xảy ra');
        }
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Có lỗi xảy ra khi lưu FAQ');
    }
  };

  const handleAddNew = () => {
    setEditingFaq(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Quản lý FAQ</h1>
            <p className="text-slate-400">Quản lý câu hỏi thường gặp</p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm FAQ
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-12 pr-8 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer min-w-[180px]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "Tất cả danh mục" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="text-2xl font-bold text-white">{faqs.length}</div>
            <div className="text-slate-400 text-sm">Tổng FAQ</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="text-2xl font-bold text-blue-400">{categories.length - 1}</div>
            <div className="text-slate-400 text-sm">Danh mục</div>
          </div>
         
        </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : faqs.length > 0 ? (
          faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Không tìm thấy FAQ nào</p>
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      <FAQModal
        faq={editingFaq}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFaq(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}