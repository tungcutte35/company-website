"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, Edit2, Trash2, Loader2, X, Save, Upload, Image as ImageIcon, Eye, Calendar, User, Tag, Star } from "lucide-react";
import { fetchJsonCached } from "@/lib/clientFetch";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  author: string;
  authorAvatar: string | null;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  featured: boolean;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    author: 'Techera Team',
    authorAvatar: '/images/authors/techera-team.jpg',
    featured: false,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [categories] = useState([
    'Xu hướng',
    'Hướng dẫn',
    'Kinh nghiệm',
    'Bảo mật',
    'Case Study',
    'Marketing',
    'Công nghệ',
    'Phân tích'
  ]);
  const hasFetched = React.useRef(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async () => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: { posts: BlogPost[] } }>(
        "/api/admin/blog"
      );
      if (result.success && result.data) {
        setPosts(result.data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      showToast('error', 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchPosts();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [modalOpen]);

  const openModal = (type: 'add' | 'edit', post?: BlogPost) => {
    setModalType(type);
    setSelectedPost(post || null);
    
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        category: post.category || '',
        author: post.author || 'Techera Team',
        authorAvatar: post.authorAvatar || '/images/authors/techera-team.jpg',
        featured: post.featured || false,
        tags: post.tags || []
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        author: 'Techera Team',
        authorAvatar: '/images/authors/techera-team.jpg',
        featured: false,
        tags: []
      });
    }
    setTagInput('');
    setModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      // Upload to the image upload API
      const result = await fetchJsonCached<{ success: boolean; url?: string; error?: string }>(
        "/api/upload/image",
        { method: "POST", body: uploadFormData }
      );
      
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image: result.url || '' }));
        showToast('success', 'Đã tải lên hình ảnh thành công');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      showToast('error', 'Không thể tải lên hình ảnh');
    } finally {
      setImageUploading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      // Upload to the image upload API
      const result = await fetchJsonCached<{ success: boolean; url?: string; error?: string }>(
        "/api/upload/image",
        { method: "POST", body: uploadFormData }
      );
      
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, authorAvatar: result.url || '' }));
        showToast('success', 'Đã tải lên avatar thành công');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      showToast('error', 'Không thể tải lên avatar');
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('error', 'Kích thước file không được vượt quá 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Vui lòng chọn file hình ảnh');
        return;
      }
      handleImageUpload(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim() || !formData.content?.trim() || !formData.category) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setActionLoading(true);
    try {
      const method = modalType === 'add' ? 'POST' : 'PUT';
      const body = modalType === 'edit' 
        ? { id: selectedPost?.id, ...formData }
        : formData;

      const result = await fetchJsonCached<{ success: boolean; data?: BlogPost; error?: string }>(
        "/api/admin/blog",
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (result.success) {
        showToast('success', modalType === 'add' ? 'Đã tạo bài viết thành công' : 'Đã cập nhật bài viết thành công');
        fetchPosts();
        setModalOpen(false);
      } else {
        showToast('error', result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      showToast('error', 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: BlogPost; error?: string }>(
        "/api/admin/blog",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, featured: !featured }),
        }
      );
      if (result.success) {
        showToast('success', 'Đã cập nhật trạng thái nổi bật');
        fetchPosts();
      } else {
        showToast('error', result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Toggle featured failed:', error);
      showToast('error', 'Có lỗi xảy ra');
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) return;
    
    try {
      const result = await fetchJsonCached<{ success: boolean; data?: { id: number }; error?: string }>(
        `/api/admin/blog?id=${id}`,
        { method: "DELETE" }
      );
      
      if (result.success) {
        showToast('success', 'Đã xóa bài viết thành công');
        fetchPosts();
      } else {
        showToast('error', result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('error', 'Có lỗi xảy ra khi xóa bài viết');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-100 px-6 py-1 rounded-md shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white font-medium animate-in slide-in-from-right duration-300`}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Quản lý Blog ({posts.length} bài viết)</h3>
            </div>
            <button
              onClick={() => openModal('add')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm bài viết
            </button>
          </div>
          
          {/* Posts List */}
          <div className="p-6">
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors">
                    {/* Post Image */}
                    <div className="shrink-0">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                    </div>

                    {/* Post Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium truncate">{post.title}</h4>
                        {post.featured && (
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Nổi bật
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} views
                        </span>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(post.id, post.featured)}
                        className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                          post.featured
                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                            : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                        }`}
                      >
                        {post.featured ? "★ Featured" : "☆ Feature"}
                      </button>
                      <button
                        onClick={() => openModal('edit', post)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Chưa có bài viết nào</p>
                <button
                  onClick={() => openModal('add')}
                  className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Tạo bài viết đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 "
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="h-full px-4 py-8 flex items-start justify-center">
            <div 
              className="relative bg-slate-900 rounded-2xl border border-white/10 w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-slate-900 rounded-t-2xl z-10">
                <h3 className="font-semibold text-white">
                  {modalType === 'add' ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content - 2 Column Grid Layout */}
              <div className="p-4 flex-1 min-h-0 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-1">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Tiêu đề <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập tiêu đề bài viết..."
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Mô tả ngắn <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        placeholder="Mô tả ngắn gọn về nội dung bài viết..."
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                      />
                    </div>

                    {/* Category and Author */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Danh mục <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Tác giả
                        </label>
                        <input
                          type="text"
                          placeholder="Tên tác giả"
                          value={formData.author}
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Author Avatar */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Avatar tác giả
                      </label>
                      <div className="space-y-3">
                        {formData.authorAvatar && (
                          <div className="relative inline-block">
                            <img
                              src={formData.authorAvatar}
                              alt="Author Avatar Preview"
                              className="w-16 h-16 object-cover rounded-full border border-slate-700"
                            />
                            <button
                              onClick={() => setFormData({...formData, authorAvatar: ''})}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors">
                            {imageUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {imageUploading ? 'Đang tải lên...' : 'Chọn avatar'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    showToast('error', 'Kích thước file không được vượt quá 5MB');
                                    return;
                                  }
                                  if (!file.type.startsWith('image/')) {
                                    showToast('error', 'Vui lòng chọn file hình ảnh');
                                    return;
                                  }
                                  handleAvatarUpload(file);
                                }
                              }}
                              className="hidden"
                              disabled={imageUploading}
                            />
                          </label>
                        </div>
                        
                        <span className="text-xs text-slate-500 block">
                        </span>
                      </div>
                    </div>

                    {/* Image Upload */}
                    
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Hình ảnh 
                      </label>
                      <div className="space-y-3">
                        {formData.image && (
                          <div className="relative inline-block">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-32 h-16 ob16ct-cover rounded-lg border border-slate-700"
                            />
                            <button
                              onClick={() => setFormData({...formData, image: ''})}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors">
                            {imageUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {imageUploading ? 'Đang tải lên...' : 'Chọn hình ảnh'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={imageUploading}
                            />
                          </label>
                        </div>
                        {/* <span className="text-xs text-slate-500 block">
                          Định dạng: JPG, PNG, WebP. Tối đa 5MB
                        </span> */}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Tags
                      </label>
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập tag và nhấn Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button
                            onClick={addTag}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                          >
                            Thêm
                          </button>
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(tag)}
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

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 ">
                        Nội dung (Markdown) <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        placeholder="Viết nội dung bài viết bằng Markdown..."
                        rows={12}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-y min-h-[300px] font-mono text-sm transition-colors"
                      />
                      {/* <p className="text-xs text-slate-500 mt-1">
                        Hỗ trợ Markdown: **bold**, *italic*, # heading, - list, [link](url), ![image](url)
                      </p> */}
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="featured" className="text-slate-300 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Đánh dấu là bài viết nổi bật
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-1 border-t border-white/10 mt-1">
                  <button
                    onClick={handleSubmit}
                    disabled={actionLoading || !formData.title?.trim() || !formData.content?.trim() || !formData.category}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Save className="w-4 h-4" />
                    {modalType === 'add' ? 'Tạo bài viết' : 'Cập nhật bài viết'}
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}