'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface NewsItem {
  id: string
  news_title: string
  picture_link?: string
  headline?: string
  is_active: boolean
  created_at: string
}

interface NewsTickerProps {
  news?: NewsItem[]
  intervalMs?: number
}

export default function NewsTicker({ news: externalNews, intervalMs = 5000 }: NewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>(externalNews || [])
  const [loading, setLoading] = useState(!externalNews)
  const [showNotice, setShowNotice] = useState(true)

  useEffect(() => {
    if (externalNews && externalNews.length > 0) {
      setNews(externalNews)
      setLoading(false)
      return
    }
    const controller = new AbortController()
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store', signal: controller.signal })
        if (res.ok) {
          const json = await res.json()
          setNews(json.news || [])
        }
      } catch {
        // aborted or network error
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
    const timer = setInterval(fetchNews, 60000)
    return () => {
      controller.abort()
      clearInterval(timer)
    }
  }, [externalNews])

  const dismissNotice = () => {
    setShowNotice(false)
  }

  if (loading || news.length === 0) return null

  const noticeNews = news[0]
  const separator = '    ★    '
  const tickerText = news.map((item) => item.news_title).join(separator)

  return (
    <div className="w-full bg-slate-900 text-white relative">
      <style>{`
        @keyframes continuousTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: continuousTicker ${Math.max(intervalMs, news.length * 12)}s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {showNotice && noticeNews?.picture_link && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-[min(92vw,360px)]">
            <img
              src={noticeNews.picture_link}
              alt={noticeNews.news_title}
              className="w-full h-48 sm:h-56 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
              <p className="text-white font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                {noticeNews.news_title}
              </p>
            </div>
            <button
              onClick={dismissNotice}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition"
              aria-label="Dismiss notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-950 border-t border-slate-800 overflow-hidden h-10 sm:h-11 flex items-center">
        <div className="flex-shrink-0 px-3 sm:px-4 bg-amber-400 text-slate-950 h-full flex items-center z-10">
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">HEADLINES</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="ticker-track">
            <span className="whitespace-nowrap text-xs sm:text-sm text-slate-100 font-medium px-2">
              {tickerText}
            </span>
            <span className="whitespace-nowrap text-xs sm:text-sm text-slate-100 font-medium px-2" aria-hidden="true">
              {tickerText}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
