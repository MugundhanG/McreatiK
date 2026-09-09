/* ============================================
   Blog Section — Tech & Creative
   Pulls published posts from the CMS backend
   (site=TECH). Falls back to an honest "coming
   soon" state with planned topics when there are
   none yet, rather than fabricated placeholder
   articles.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiEdit3, FiAlertCircle } from 'react-icons/fi'
import { fetchBlogPosts } from '../../utils/cmsApi'
import { TECH_BLOG_TOPICS } from '../../utils/constants'
import SectionHeading from '../ui/SectionHeading'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TechBlog = memo(function TechBlog() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetchBlogPosts({ site: 'TECH' })
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
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Notes & Insights" title="Blog" subtitle="Web design, SEO, and lessons from client projects." />

        {status === 'loading' && (
          <div className="py-10 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#1E4FD9] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="py-10 flex flex-col items-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-stone-600">Couldn't load the blog right now. Please try again shortly.</p>
          </div>
        )}

        {status === 'ready' && posts.length === 0 && (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full border border-[#1E4FD9]/30 flex items-center justify-center mb-6">
              <FiEdit3 className="w-5 h-5 text-[#1E4FD9]" />
            </div>
            <p className="text-stone-600 leading-relaxed max-w-md mx-auto">
              First articles coming soon. Here's what we're planning to write about:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {TECH_BLOG_TOPICS.map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-stone-200 text-stone-600"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
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
                <Link to={`/tech/blog/${post.slug}`} className="group flex gap-5 items-start">
                  {post.cover && (
                    <div className="relative w-28 h-28 shrink-0 overflow-hidden rounded-lg border border-stone-200">
                      <img
                        src={post.cover.url}
                        alt={post.cover.altText || post.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-mono-label text-[10px] uppercase text-stone-400">{formatDate(post.createdAt)}</p>
                    <h3 className="font-display font-bold text-xl text-stone-900 mt-1 group-hover:text-[#1E4FD9] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-sm text-stone-600 mt-2">{post.excerpt}</p>}
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

export default TechBlog
