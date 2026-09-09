/* ============================================
   BlogPost — single Tech blog post
   Fetches by slug and renders the WYSIWYG
   content. Sanitized client-side with DOMPurify
   before rendering as HTML.
   ============================================ */

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import { fetchBlogPost } from '../../utils/cmsApi'
import { useSEO } from '../../hooks/useSEO'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetchBlogPost(slug)
      .then((data) => {
        if (!cancelled) {
          setPost(data)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  useSEO({
    title: post ? `${post.seoTitle || post.title} | McreatiK Tech & Creative` : null,
    description: post ? post.seoDescription || post.excerpt || `${post.title} — from the McreatiK Tech blog.` : null,
    path: `/tech/blog/${slug}`,
    image: post?.cover?.url,
  })

  if (status === 'loading') {
    return (
      <div className="py-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#1E4FD9] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'error' || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32 text-center">
        <FiAlertCircle className="w-6 h-6 text-red-600 mx-auto mb-3" />
        <p className="text-stone-600 mb-6">This post couldn't be found.</p>
        <Link to="/tech/blog" className="font-mono-label text-xs uppercase text-[#1E4FD9] hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const safeContent = DOMPurify.sanitize(post.content)

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
      <Link
        to="/tech/blog"
        className="inline-flex items-center gap-2 font-mono-label text-xs uppercase text-stone-500 hover:text-[#1E4FD9] transition-colors mb-8"
      >
        <FiArrowLeft className="w-3.5 h-3.5" /> Back to Blog
      </Link>

      <p className="font-mono-label text-[11px] uppercase text-stone-400">{formatDate(post.createdAt)}</p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 mt-2 mb-6">{post.title}</h1>

      {post.cover && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-stone-200 mb-8">
          <img
            src={post.cover.url}
            alt={post.cover.altText || post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="text-stone-800 leading-relaxed [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#1E4FD9]/40 [&_blockquote]:pl-4 [&_blockquote]:text-stone-600 [&_blockquote]:italic"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border border-stone-200 text-stone-600">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
