'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Megaphone, Plus, Edit, Archive, CheckCircle,
    Trash2, Eye, Filter, Save, X, Calendar
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import {
    getAdminAnnouncements, createAnnouncement, updateAnnouncement,
    publishAnnouncement, archiveAnnouncement, deleteAnnouncement,
    seedMockAnnouncements, Announcement
} from '@/lib/admin/announcement-service'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function AnnouncementsPage() {
    const { adminUser } = useAdmin()
    const [posts, setPosts] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')

    // Edit/Create Modal State
    const [isEditing, setIsEditing] = useState(false)
    const [currentPost, setCurrentPost] = useState<Partial<Announcement>>({})

    useEffect(() => {
        loadData()
    }, [filterStatus])

    const loadData = async () => {
        setLoading(true)
        const data = await getAdminAnnouncements({ status: filterStatus })
        setPosts(data)
        setLoading(false)
    }

    const handleCreate = () => {
        setCurrentPost({
            title: '', content: '', category: 'update',
            audience: 'all', status: 'draft', is_important: false
        })
        setIsEditing(true)
    }

    const handleEdit = (post: Announcement) => {
        setCurrentPost(post)
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!adminUser) return

        try {
            if (currentPost.id) {
                // Update
                await updateAnnouncement(adminUser, currentPost.id, currentPost)
            } else {
                // Create
                await createAnnouncement(adminUser, currentPost)
            }
            setIsEditing(false)
            alert('บันทึกเรียบร้อย')
            loadData()
        } catch (e) {
            alert('เกิดข้อผิดพลาด: ' + e)
        }
    }

    const handleAction = async (action: 'publish' | 'archive' | 'delete', id: string) => {
        if (!adminUser || !confirm(`ยืนยันการ ${action}?`)) return
        try {
            if (action === 'publish') await publishAnnouncement(adminUser, id)
            if (action === 'archive') await archiveAnnouncement(adminUser, id)
            if (action === 'delete') await deleteAnnouncement(adminUser, id)
            loadData()
        } catch (e) { alert('Error' + e) }
    }

    const handleSeed = async () => {
        if (!adminUser) return
        await seedMockAnnouncements(adminUser)
        loadData()
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Megaphone className="w-8 h-8 text-pink-600" />
                            ข่าวสารและประกาศ (Announcements)
                        </h1>
                        <p className="text-gray-500 mt-1">
                            จัดการข่าวประชาสัมพันธ์ บทความ และการแจ้งเตือน
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSeed} className="text-xs text-gray-400 hover:text-gray-600 mr-2">Seed Data</button>
                        <button
                            onClick={handleCreate}
                            className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-pink-700 shadow-lg"
                        >
                            <Plus className="w-5 h-5" /> สร้างประกาศใหม่
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                    {['all', 'draft', 'published', 'archived'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 text-sm font-bold capitalize border-b-2 transition-colors ${filterStatus === s ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="grid grid-cols-1 gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6">
                            {/* Cover Image or Placeholder */}
                            <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                                {post.cover_image ? (
                                    <img src={post.cover_image} className="w-full h-full object-cover" alt="cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <Megaphone className="w-10 h-10" />
                                    </div>
                                )}
                                {post.is_important && (
                                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow">Important</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-700' :
                                                    post.status === 'archived' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {post.status}
                                            </span>
                                            <span className="text-gray-400 text-xs">|</span>
                                            <span className="text-gray-500 text-xs uppercase font-medium">{post.category}</span>
                                            <span className="text-gray-400 text-xs">|</span>
                                            <span className="text-gray-500 text-xs font-medium">To: {post.audience}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">{post.content}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-400">
                                        <div>สร้างเมื่อ: {format(post.created_at, 'dd MMM yyyy')}</div>
                                        {post.published_at && <div className="text-green-600">เผยแพร่: {format(post.published_at, 'dd MMM yyyy')}</div>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button onClick={() => handleEdit(post)} className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 text-sm font-medium px-2 py-1">
                                        <Edit className="w-4 h-4" /> แก้ไข
                                    </button>
                                    {post.status !== 'published' && (
                                        <button onClick={() => handleAction('publish', post.id)} className="flex items-center gap-1 text-gray-600 hover:text-green-600 text-sm font-medium px-2 py-1">
                                            <CheckCircle className="w-4 h-4" /> Publish
                                        </button>
                                    )}
                                    {post.status !== 'archived' && (
                                        <button onClick={() => handleAction('archive', post.id)} className="flex items-center gap-1 text-gray-600 hover:text-orange-600 text-sm font-medium px-2 py-1">
                                            <Archive className="w-4 h-4" /> Archive
                                        </button>
                                    )}
                                    <button onClick={() => handleAction('delete', post.id)} className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-sm font-medium px-2 py-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            ยังไม่มีประกาศ
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold">{currentPost.id ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'}</h2>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
                                <div>
                                    <label className="block text-sm font-medium mb-1">หัวข้อประกาศ (Title)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full border rounded-lg p-2"
                                        value={currentPost.title || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
                                        <select
                                            className="w-full border rounded-lg p-2"
                                            value={currentPost.category}
                                            onChange={e => setCurrentPost({ ...currentPost, category: e.target.value as any })}
                                        >
                                            <option value="update">Update</option>
                                            <option value="promotion">Promotion</option>
                                            <option value="warning">Warning</option>
                                            <option value="system">System</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">กลุ่มเป้าหมาย</label>
                                        <select
                                            className="w-full border rounded-lg p-2"
                                            value={currentPost.audience}
                                            onChange={e => setCurrentPost({ ...currentPost, audience: e.target.value as any })}
                                        >
                                            <option value="all">Everyone</option>
                                            <option value="users">Buyers Only</option>
                                            <option value="sellers">Sellers Only</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">เนื้อหา (Content)</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full border rounded-lg p-2 font-light"
                                        value={currentPost.content || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full border rounded-lg p-2"
                                        value={currentPost.cover_image || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, cover_image: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="imp"
                                        className="w-5 h-5"
                                        checked={currentPost.is_important}
                                        onChange={e => setCurrentPost({ ...currentPost, is_important: e.target.checked })}
                                    />
                                    <label htmlFor="imp" className="text-sm font-bold text-red-600">ตั้งเป็นประกาศสำคัญ (Pinned / Critical)</label>
                                </div>
                            </form>

                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg">ยกเลิก</button>
                                <button onClick={handleSave} className="px-6 py-2 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700">บันทึก</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
