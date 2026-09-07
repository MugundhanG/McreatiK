/* ============================================
   BlogPost — single Studios blog post
   Fetches by slug and renders the WYSIWYG
   content. Sanitized client-side with DOMPurify
   before rendering as HTML.
   ============================================ */

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import { fetchBlogPost } from '../../utils/cmsApi'

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
          document.title = `${data.seoTitle || data.title} | McreatiK Studios`
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (status === 'loading') {
    return (
      <div className="py-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'error' || !post) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-32 text-center">
        <FiAlertCircle className="w-6 h-6 text-[#8B2E2A] mx-auto mb-3" />
        <p className="font-body text-[#6B6153] mb-6">This post couldn't be found.</p>
        <Link to="/studios/blog" className="font-mono-label text-xs uppercase text-[#C9971F] hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const safeContent = DOMPurify.sanitize(post.content)

  return (
    <article className="max-w-2xl mx-auto px-5 sm:px-8 pb-24">
      <Link
        to="/studios/blog"
        className="inline-flex items-center gap-2 font-mono-label text-xs uppercase text-[#6B6153] hover:text-[#C9971F] transition-colors mb-8"
      >
        <FiArrowLeft className="w-3.5 h-3.5" /> Back to Blog
      </Link>

      <p className="font-mono-label text-[11px] uppercase text-[#6B6153]">{formatDate(post.createdAt)}</p>
      <h1 className="font-display italic text-3xl sm:text-4xl text-[#1C1710] mt-2 mb-6">{post.title}</h1>

      {post.cover && (
        <div className="film-frame relative aspect-[16/9] overflow-hidden mb-8">
          <img
            src={post.cover.url}
            alt={post.cover.altText || post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="font-body text-[#1C1710] leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C9971F]/40 [&_blockquote]:pl-4 [&_blockquote]:text-[#6B6153] [&_blockquote]:italic"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border border-black/10 text-[#4A4438]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
