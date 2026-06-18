'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [imageBroken, setImageBroken] = useState(false)

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

  useEffect(() => {
    if (showNotice && news.length > 0 && news[0]?.picture_link) {
      const t = setTimeout(() => setShowNotice(false), 5000)
      return () => clearTimeout(t)
    }
  }, [showNotice, news])

  if (loading || news.length === 0) return null

  const noticeNews = news[0]
  const displayTitle = noticeNews.headline?.trim() || noticeNews.news_title
  const separator = '    ★    '
  const allTitles = news.map((item) => item.headline?.trim() || item.news_title).join(separator)

  const shouldShowNotice = !!noticeNews.picture_link && !imageBroken

  return (
    <div className="w-full bg-slate-900 text-white relative">
      {shouldShowNotice && showNotice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-[min(94vw,480px)]">
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              <img
                src={noticeNews.picture_link}
                alt={displayTitle}
                className="absolute inset-0 w-full h-full object-contain bg-slate-50 p-2"
                onError={() => setImageBroken(true)}
              />
            </div>
            <div className="p-4 bg-white">
              <p className="text-slate-900 font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                {displayTitle}
              </p>
            </div>
            <button
              onClick={() => setShowNotice(false)}
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
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">NOTICES</span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <TickerScroll text={allTitles} speed={intervalMs} />
        </div>
      </div>
    </div>
  )
}

function TickerScroll({ text, speed }: { text: string; speed: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const posRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const half = track.scrollWidth / 2
    const step = () => {
      posRef.current -= 0.8
      if (posRef.current <= -half) {
        posRef.current = 0
      }
      track.style.transform = `translate3d(${posRef.current}px,0,0)`
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [text, speed])

  return (
    <div ref={trackRef} className="whitespace-nowrap text-xs sm:text-sm text-slate-100 font-medium px-2 will-change-transform inline-flex">
      <span>{text}</span>
      <span className="ml-8" aria-hidden="true">{text}</span>
    </div>
  )
}
