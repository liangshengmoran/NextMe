'use client'

import { motion } from 'framer-motion'
import { SkeletonBase } from '../components/skeleton-base'
import Image from 'next/image'
import { EMOJI_MAP } from '@/utils/emoji'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useCurrentUser } from '@/contexts/CurrentUserContext'

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN })
  } catch {
    return dateString
  }
}

function renderCommentText(text: string) {
  return text.split(/(:[^:]+:)/g).map((part, index) => {
    const emojiPath = EMOJI_MAP[part as keyof typeof EMOJI_MAP]
    if (!emojiPath) return <span key={index}>{part}</span>

    try {
      return (
        <Image
          key={index}
          src={emojiPath}
          alt={part}
          width={20}
          height={20}
          className="inline-block h-5 w-5 align-middle mx-0.5"
          style={{ 
            verticalAlign: 'text-bottom',
            margin: '0 0.1em',
            transform: 'translateY(2px)' 
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )
    } catch (error) {
      return <span key={index}>{part}</span>
    }
  })
}

export default function GuestbookEntries() {
  const [currentUser] = useCurrentUser()

  const entries = [
    {
      id: 95,
      body: '👌前端部分将会加入到博客框架中。',
      created_by: '仓鼠',
      created_at: '2024-11-01 09:46:41',
      updated_at: '2024-11-01 09:46:52',
      is_reply: 2,
      reply_to: 94,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 94,
      body: '大佬评论页有打算开源吗😘',
      created_by: 'pangxf',
      created_at: '2024-11-01 09:42:22',
      updated_at: '2024-11-01 09:42:22',
      is_reply: 1,
      reply_to: 0,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 84,
      body: '也没有...您可以在这里https://buycoffee.top/coffee找到赞赏与联系方式。',
      created_by: '仓鼠',
      created_at: '2024-10-23 01:09:36',
      updated_at: '2024-10-23 01:09:47',
      is_reply: 2,
      reply_to: 83,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 83,
      body: '额我是说你有群什么的吗？:微笑::微笑:',
      created_by: 'dodo',
      created_at: '2024-10-22 16:45:03',
      updated_at: '2024-10-22 16:45:03',
      is_reply: 1,
      reply_to: 0,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 82,
      body: '没有，都是深夜里慢慢磨...:发红包::哈士奇失去意识::哈士奇失去意识::嘿哈:',
      created_by: '仓鼠',
      created_at: '2024-10-22 16:17:42',
      updated_at: '2024-10-22 16:17:50',
      is_reply: 2,
      reply_to: 81,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 81,
      body: '有组织吗？这风格一眼爱了必须赞赏。',
      created_by: 'dodo',
      created_at: '2024-10-22 16:09:07',
      updated_at: '2024-10-22 16:09:07',
      is_reply: 1,
      reply_to: 0,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 80,
      body: ':微笑::微笑::发红包::哈士奇失去意识::哈士奇失去意识::嘿哈:',
      created_by: 'dodo',
      created_at: '2024-10-22 16:09:07',
      updated_at: '2024-10-22 16:09:07',
      is_reply: 1,
      reply_to: 0,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
    {
      id: 79,
      body: '大佬，我这个评论怎么不见了？',
      created_by: 'dodo',
      created_at: '2024-10-22 16:09:07',
      updated_at: '2024-10-22 16:09:07',
      is_reply: 1,
      reply_to: 0,
      slug: 'guestbook',
      is_banner: 2,
      banner_url: '',
    },
  ]

  if (!entries || entries.length === 0) {
    return (
      <>
        <div className="flex flex-col">
          <SkeletonBase className="h-5 w-52" />
          <SkeletonBase className="mt-5 h-5 w-52" />
          <SkeletonBase className="mt-5 h-5 w-32" />
          <SkeletonBase className="mt-5 h-5 w-32" />
          <SkeletonBase className="mt-5 h-5 w-52" />
          <SkeletonBase className="mt-5 h-5 w-52" />
          <SkeletonBase className="mt-5 h-5 w-32" />
        </div>
      </>
    )
  }

  const guestbooks = entries.filter((entry) => entry.is_reply === 1)
  const replies = entries.filter((entry) => entry.is_reply === 2)

  return guestbooks?.map((entry, index) => {
    const isAuthor = entry.created_by === '仓鼠'
    const isCurrentUser = entry.created_by === currentUser?.name
    const isOtherUser = !isAuthor && !isCurrentUser
    const reply = replies.find(reply => reply.reply_to === entry.id)

    if (entry.is_banner === 1) {
      return (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-4 flex w-full flex-col items-center"
        >
          <a
            target="_blank"
            href={entry.banner_url}
            className="rounded-lg bg-blue-700 px-2 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-700/20 transition-shadow duration-300 hover:shadow-none dark:shadow-none"
          >
            {renderCommentText(entry.body)}
          </a>
        </motion.div>
      )
    }

    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="mb-[1.2rem] last:mb-0 flex flex-col gap-[1.2rem]"
      >
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
            isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' :
            isAuthor ? 'bg-emerald-50 dark:bg-emerald-900/20' :
            'bg-neutral-100 dark:bg-neutral-700/20'
          }`}>
            <div className={`text-sm ${
              isCurrentUser ? 'text-blue-800 dark:text-blue-200' :
              isAuthor ? 'text-emerald-800 dark:text-emerald-200' :
              'text-neutral-700 dark:text-neutral-200'
            }`}>
              {renderCommentText(entry.body)}
            </div>
            <div className={`mt-1 text-xs ${
              isCurrentUser ? 'text-blue-600/80 dark:text-blue-300/70' :
              isAuthor ? 'text-emerald-600/80 dark:text-emerald-300/70' :
              'text-neutral-500/80 dark:text-neutral-400/70'
            } ${isCurrentUser ? 'text-right' : ''}`}>
              {entry.created_by} · {formatDate(entry.created_at)}
            </div>
          </div>
        </div>

        {reply && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.3 + 0.1 }}
            className={`flex ${reply.created_by === '仓鼠' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
              reply.created_by === '仓鼠' 
                ? 'bg-amber-50 dark:bg-amber-900/20' 
                : 'bg-neutral-100 dark:bg-neutral-700/20'
            }`}>
              <div className={`text-sm ${
                reply.created_by === '仓鼠'
                  ? 'text-amber-800 dark:text-amber-200'
                  : 'text-neutral-700 dark:text-neutral-200'
              }`}>
                {renderCommentText(reply.body)}
              </div>
              <div className={`mt-1 text-xs ${
                reply.created_by === '仓鼠'
                  ? 'text-right text-amber-600/80 dark:text-amber-300/70'
                  : 'text-neutral-500/80 dark:text-neutral-400/70'
              }`}>
                {reply.created_by === '仓鼠' ? '官方回复' : '回复'} · {formatDate(reply.created_at)}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  })
}
