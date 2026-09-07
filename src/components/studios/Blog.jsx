/* ============================================
   Blog Section — Studios
   Pulls published posts from the CMS backend.
   Falls back to an honest "coming soon" state
   with planned topics when there are none yet,
   rather than fabricated placeholder articles.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiEdit3, FiAlertCircle } from 'react-icons/fi'
import { fetchBlogPosts } from '../../utils/cmsApi'
import { STUDIOS_BLOG_TOPICS } from '../../utils/constants'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const StudiosBlog = memo(function StudiosBlog() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetchBlogPosts()
      .then((data) => {
        if (!cancelled) {
          setPosts(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="relative py-24 lg:py-32 bg-[#FAF7F0]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Stories & notes</p>
          <h1 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710] mb-6">Blog</h1>
        </motion.div>

        {status === 'loading' && (
          <div className="py-10 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="py-10 flex flex-col items-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-[#8B2E2A]" />
            <p className="font-body text-[#6B6153]">Couldn't load the blog right now. Please try again shortly.</p>
          </div>
        )}

        {status === 'ready' && posts.length === 0 && (
          <>
            <div className="w-14 h-14 mx-auto rounded-full border border-[#C9971F]/40 flex items-center justify-center mb-6">
              <FiEdit3 className="w-5 h-5 text-[#C9971F]" />
            </div>
            <p className="font-body text-[#6B6153] leading-relaxed max-w-md mx-auto">
              First stories coming soon. Here's what we're planning to write about:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {STUDIOS_BLOG_TOPICS.map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-black/10 text-[#4A4438]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </>
        )}

        {status === 'ready' && posts.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-8 text-left">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <Link to={`/studios/blog/${post.slug}`} className="group flex gap-5 items-start">
                  {post.cover && (
                    <div className="film-frame relative w-28 h-28 shrink-0 overflow-hidden">
                      <img
                        src={post.cover.url}
                        alt={post.cover.altText || post.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-mono-label text-[10px] uppercase text-[#6B6153]">{formatDate(post.createdAt)}</p>
                    <h3 className="font-display text-xl text-[#1C1710] mt-1 group-hover:text-[#C9971F] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="font-body text-sm text-[#6B6153] mt-2">{post.excerpt}</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
})

export default StudiosBlog
