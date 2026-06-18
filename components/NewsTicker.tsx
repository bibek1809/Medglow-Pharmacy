'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showNotice, setShowNotice] = useState(true)
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news', { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setNews(json.news || [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (externalNews && externalNews.length > 0) {
      setNews(externalNews)
      setLoading(false)
      return
    }
    fetchNews()
    const timer = setInterval(fetchNews, 60000)
    return () => clearInterval(timer)
  }, [externalNews, fetchNews])

  useEffect(() => {
    if (news.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [news.length, isPaused, intervalMs])

  const dismissNotice = useCallback(() => {
    setShowNotice(false)
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
  }, [])

  useEffect(() => {
    if (showNotice) {
      noticeTimerRef.current = setTimeout(dismissNotice, 8000)
    }
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    }
  }, [showNotice, dismissNotice])

  if (loading || news.length === 0) return null

  const noticeNews = news.find((n) => n.picture_link) || news[0]
  const headlineNews = news.filter((n) => n.headline)
  const displayHeadline = headlineNews.length > 0 ? headlineNews[currentIndex % headlineNews.length] : news[currentIndex % news.length]

  return (
    <div className="w-full bg-slate-900 text-white relative">
      {/* Notice Popup */}
      {showNotice && noticeNews?.picture_link && (
        <div className="relative w-full">
          <img
            src={noticeNews.picture_link}
            alt={noticeNews.news_title}
            className="w-full h-20 sm:h-24 md:h-28 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center p-4">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-0.5">Notice</p>
              <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-2">{noticeNews.news_title}</h3>
            </div>
          </div>
          <button
            onClick={dismissNotice}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Headline Ticker */}
      <div className="bg-slate-950 border-t border-slate-800 overflow-hidden h-10 sm:h-11 flex items-center">
        <div className="flex-shrink-0 px-3 sm:px-4 bg-amber-400 text-slate-950 h-full flex items-center">
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">HEADLINES</span>
        </div>

        <div
          className="flex-1 flex items-center overflow-hidden px-2 cursor-pointer select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {headlineNews.length > 0 ? (
            <div className="overflow-hidden w-full">
              <div
                key={displayHeadline.id + '-' + currentIndex}
                className="whitespace-nowrap text-xs sm:text-sm text-slate-100 font-medium animate-[tickerSlide_0.6s_ease-in-out]"
                style={{ paddingLeft: '1rem' }}
              >
                {displayHeadline.headline} <span className="text-amber-400 mx-3">|</span> {displayHeadline.news_title}
              </div>
            </div>
          ) : (
            <div className="whitespace-nowrap text-xs sm:text-sm text-slate-300 px-2">
              {news[0]?.news_title}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="flex-shrink-0 px-3 border-l border-slate-800 h-full flex items-center justify-center text-slate-400 hover:text-white transition"
          aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
        >
          {isPaused ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          )}
        </button>
      </div>
    </div>
  )
}


export default function NewsTicker({ intervalMs = 5000 }: NewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showNotice, setShowNotice] = useState(true)
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout>> | null(null)

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news', { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setNews(json.news || [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
    const timer = setInterval(fetchNews, 60000)
    return () => clearInterval(timer)
  }, [fetchNews])

  useEffect(() => {
    if (news.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [news.length, isPaused, intervalMs])

  const dismissNotice = useCallback(() => {
    setShowNotice(false)
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
  }, [])

  useEffect(() => {
    if (showNotice) {
      noticeTimerRef.current = setTimeout(dismissNotice, 8000)
    }
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    }
  }, [showNotice, dismissNotice])

  if (loading || news.length === 0) return null

  const noticeNews = news.find((n) => n.picture_link) || news[0]
  const headlineNews = news.filter((n) => n.headline)
  const displayHeadline = headlineNews.length > 0 ? headlineNews[currentIndex % headlineNews.length] : news[currentIndex % news.length]

  return (
    <div className="w-full bg-slate-900 text-white relative">
      {/* Notice Popup */}
      {showNotice && noticeNews?.picture_link && (
        <div className="relative w-full">
          <img
            src={noticeNews.picture_link}
            alt={noticeNews.news_title}
            className="w-full h-20 sm:h-24 md:h-28 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center p-4">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-0.5">Notice</p>
              <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-2">{noticeNews.news_title}</h3>
            </div>
          </div>
          <button
            onClick={dismissNotice}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Headline Ticker */}
      <div className="bg-slate-950 border-t border-slate-800 overflow-hidden h-10 sm:h-11 flex items-center">
        <div className="flex-shrink-0 px-3 sm:px-4 bg-amber-400 text-slate-950 h-full flex items-center">
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">HEADLINES</span>
        </div>

        <div
          className="flex-1 flex items-center overflow-hidden px-2 cursor-pointer select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {headlineNews.length > 0 ? (
            <div className="overflow-hidden w-full">
              <div
                key={displayHeadline.id + '-' + currentIndex}
                className="whitespace-nowrap text-xs sm:text-sm text-slate-100 font-medium animate-[tickerSlide_0.6s_ease-in-out]"
                style={{ paddingLeft: '1rem' }}
              >
                {displayHeadline.headline} <span className="text-amber-400 mx-3">|</span> {displayHeadline.news_title}
              </div>
            </div>
          ) : (
            <div className="whitespace-nowrap text-xs sm:text-sm text-slate-300 px-2">
              {news[0]?.news_title}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="flex-shrink-0 px-3 border-l border-slate-800 h-full flex items-center justify-center text-slate-400 hover:text-white transition"
          aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
        >
          {isPaused ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
