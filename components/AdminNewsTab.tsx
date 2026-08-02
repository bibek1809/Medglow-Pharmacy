'use client'

import { useState, type FormEvent } from 'react'

interface NewsItem {
  id: string
  news_title: string
  picture_link?: string
  headline?: string
  is_active: boolean
  created_at: string
}

interface AdminNewsTabProps {
  news: NewsItem[]
  newNews: { news_title: string; picture_link: string; headline: string; is_active: boolean }
  editingNews: NewsItem | null
  onNewNewsChange: (v: { news_title: string; picture_link: string; headline: string; is_active: boolean }) => void
  onSetEditingNews: (n: NewsItem | null) => void
  onAdd: (e: FormEvent) => void
  onUpdate: (e: FormEvent) => void
  onDelete: (id: string) => void
}

export default function AdminNewsTab({
  news,
  newNews,
  editingNews,
  onNewNewsChange,
  onSetEditingNews,
  onAdd,
  onUpdate,
  onDelete,
}: AdminNewsTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Add News / Notice</h2>
        <form onSubmit={onAdd} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">News Title *</label>
            <input
              type="text"
              value={newNews.news_title}
              onChange={(e) => onNewNewsChange({ ...newNews, news_title: e.target.value })}
              placeholder="e.g. Free delivery for orders above NPR 20000"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Picture Link (for notice popup)</label>
            <input
              type="url"
              value={newNews.picture_link}
              onChange={(e) => onNewNewsChange({ ...newNews, picture_link: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Headline (ticker text)</label>
            <textarea
              value={newNews.headline}
              onChange={(e) => onNewNewsChange({ ...newNews, headline: e.target.value })}
              placeholder="Short headline for moving ticker..."
              rows={2}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="news-active"
              type="checkbox"
              checked={newNews.is_active}
              onChange={(e) => onNewNewsChange({ ...newNews, is_active: e.target.checked })}
              className="rounded border-slate-600 bg-slate-700 text-amber-400 focus:ring-amber-400"
            />
            <label htmlFor="news-active" className="text-sm text-slate-300">Active</label>
          </div>
          <button
            type="submit"
            className="bg-amber-400 text-slate-950 font-semibold px-6 py-2 rounded-lg hover:bg-amber-500 transition"
          >
            Add News
          </button>
        </form>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Manage News</h2>
        {news.length === 0 ? (
          <p className="text-slate-400 text-sm">No news entries yet.</p>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.news_title}</p>
                  {item.headline && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.headline}</p>}
                  {item.picture_link && (
                    <a href={item.picture_link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-1 block truncate">
                      {item.picture_link}
                    </a>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full ${item.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onSetEditingNews(item)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingNews && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Edit News</h3>
            <form onSubmit={onUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">News Title *</label>
                <input
                  type="text"
                  value={editingNews.news_title}
                  onChange={(e) => onSetEditingNews({ ...editingNews, news_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Picture Link</label>
                <input
                  type="url"
                  value={editingNews.picture_link || ''}
                  onChange={(e) => onSetEditingNews({ ...editingNews, picture_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Headline</label>
                <textarea
                  value={editingNews.headline || ''}
                  onChange={(e) => onSetEditingNews({ ...editingNews, headline: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-news-active"
                  type="checkbox"
                  checked={editingNews.is_active}
                  onChange={(e) => onSetEditingNews({ ...editingNews, is_active: e.target.checked })}
                  className="rounded border-slate-600 bg-slate-700 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="edit-news-active" className="text-sm text-slate-300">Active</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 text-slate-950 font-semibold py-2 rounded-lg hover:bg-amber-500 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => onSetEditingNews(null)}
                  className="flex-1 bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
