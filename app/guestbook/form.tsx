'use client'

import { useEffect, useState, useRef } from 'react'
import TopBlurLayer from 'app/components/top-blur-layer'
import TopCommitBar from 'app/components/top-commit-bar'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { EMOJI_MAP } from '@/utils/emoji'

export default function Form() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [entry, setEntry] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unsubmitted, setUnsubmitted] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (name || email || entry) {
      setUnsubmitted(true)
    } else {
      setUnsubmitted(false)
    }
  }, [name, email, entry])

  const handleSubmit = async () => {
    if (!name || !email || !entry) {
      alert('Please fill in all fields')
      return
    }
    setDisabled(true)
    setLoading(true)
    // TODO: Add your logic here
    // await CreateGuestbookEntry(email, entry, name)
    setEmail('')
    setEntry('')
    setName('')
    setUnsubmitted(false)
    setDisabled(false)
    setLoading(false)
  }

  const handleCancel = () => {
    setEmail('')
    setEntry('')
    setName('')
  }

  // 插入表情到输入框
  const insertEmoji = (emojiCode: string) => {
    setEntry(prev => {
      const textarea = textareaRef.current
      if (!textarea) return prev
      
      const startPos = textarea.selectionStart
      const endPos = textarea.selectionEnd
      return prev.slice(0, startPos) + emojiCode + prev.slice(endPos)
    })
    
    // 保持光标位置
    requestAnimationFrame(() => {
      const textarea = textareaRef.current
      if (textarea) {
        const newPos = textarea.selectionStart + emojiCode.length
        textarea.selectionStart = newPos
        textarea.selectionEnd = newPos
      }
    })
  }

  // 修改分页数量获取方式
  const getEmojisPerPage = () => {
    if (typeof window === 'undefined') return 48 // 服务端默认值
    return window.innerWidth >= 768 ? 50 : 48
  }

  // 在组件内添加resize监听
  useEffect(() => {
    const handleResize = () => {
      setCurrentPage(1) // 窗口大小变化时重置到第一页
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 更新分页计算
  const paginatedEmojis = Object.entries(EMOJI_MAP).slice(
    (currentPage - 1) * getEmojisPerPage(),
    currentPage * getEmojisPerPage()
  )

  return (
    <>
      <AnimatePresence>
        {unsubmitted && (
          <>
            <TopBlurLayer />
            <TopCommitBar
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              disabled={disabled}
              loading={loading}
            />
          </>
        )}
      </AnimatePresence>
      <form className="relative">
        <section className="relative">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <input
                aria-label="Your name"
                placeholder="Name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 w-full md:w-auto rounded-lg border-neutral-300 bg-neutral-100 py-2 pl-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
              />
              <input
                aria-label="Your email"
                placeholder="Email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 w-full md:w-auto rounded-lg border-neutral-300 bg-neutral-100 py-2 pl-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div className="relative w-full">
              <div className="absolute right-2 top-2 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <textarea
                ref={textareaRef}
                aria-label="Your message"
                placeholder="Message..."
                name="entry"
                required
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full min-h-[80px] rounded-lg border-neutral-300 bg-neutral-100 py-4 pl-4 pr-20 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
              />
              {showEmojiPicker && (
                <motion.div
                  className="absolute z-50 w-full max-w-[300px] rounded-xl bg-neutral-100/80 p-2 shadow-lg backdrop-blur-lg dark:bg-neutral-800/80"
                  style={{
                    top: 'calc(100% + 8px)',
                    right: '0',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-8 gap-1 md:grid-cols-10">
                        {paginatedEmojis.map(([code, path]) => (
                          <button
                            key={code}
                            onClick={() => insertEmoji(code)}
                            className="group relative h-8 w-8 rounded-md hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors"
                          >
                            <Image
                              src={path}
                              alt={code}
                              width={32}
                              height={32}
                              className="h-6 w-6 object-contain transition-transform group-hover:scale-125"
                              unoptimized
                            />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="mt-2 flex items-center justify-between px-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded px-2 py-1 hover:bg-neutral-200/50 disabled:opacity-50 dark:hover:bg-neutral-700/50"
                    >
                      上一页
                    </button>
                    <span>第 {currentPage} 页</span>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage * getEmojisPerPage() >= Object.keys(EMOJI_MAP).length}
                      className="rounded px-2 py-1 hover:bg-neutral-200/50 disabled:opacity-50 dark:hover:bg-neutral-700/50"
                    >
                      下一页
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </form>
    </>
  )
}
