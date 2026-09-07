/* ============================================
   Albums Section — Studios
   Real client albums, pulled from the CMS
   backend. Clicking an album opens the
   page-flip viewer over its cover + photos.
   ============================================ */

import React, { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiAlertCircle } from 'react-icons/fi'
import { fetchAlbums } from '../../utils/cmsApi'
import AlbumViewer from './AlbumViewer'

const StudiosAlbums = memo(function StudiosAlbums() {
  const [albums, setAlbums] = useState([])
  const [status, setStatus] = useState('loading')
  const [openAlbum, setOpenAlbum] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchAlbums()
      .then((data) => {
        if (!cancelled) {
          setAlbums(data)
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
    <section id="albums" className="relative py-24 lg:py-32 bg-[#F3EEE3] scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-xs uppercase text-[#C9971F] mb-3">Printed & bound</p>
          <h1 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-[#1C1710]">Albums</h1>
          <p className="font-body mt-4 text-[#6B6153] max-w-lg">
            A look inside the albums we've designed for clients — click one to flip through it.
          </p>
        </motion.div>

        {status === 'loading' && (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#C9971F] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-[#8B2E2A]" />
            <p className="font-body text-[#6B6153]">Couldn't load the albums right now. Please try again shortly.</p>
          </div>
        )}

        {status === 'ready' && albums.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <FiBook className="w-8 h-8 text-[#1C1710]/30" />
            <p className="font-body text-[#6B6153]">The first albums are on their way — check back soon.</p>
          </div>
        )}

        {status === 'ready' && albums.length > 0 && (
          <div className="grid grid-cols-1 gap-x-10 gap-y-16">
            {albums.map((album, index) => (
              <motion.button
                key={album.id}
                onClick={() => setOpenAlbum(album)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-left group"
              >
                <div className="film-frame relative aspect-[16/9] overflow-hidden">
                  {album.cover ? (
                    <img
                      src={album.cover.url}
                      alt={album.cover.altText || album.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#EDE7D3]">
                      <FiBook className="w-8 h-8 text-[#1C1710]/20" />
                    </div>
                  )}
                  <div className="film-grain" />
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20" />
                  {album.location && (
                    <span className="absolute top-3 left-3 font-mono-label text-[10px] uppercase text-white/80 drop-shadow">
                      {album.location}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 font-mono-label text-[10px] uppercase text-white/80 drop-shadow">
                    {album.photos.length} photos
                  </span>
                </div>
                <p className="font-mono-label text-[11px] uppercase text-[#6B6153] mt-3">
                  Album {String(index + 1).padStart(2, '0')}/{String(albums.length).padStart(2, '0')} — {album.title}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {openAlbum && <AlbumViewer album={openAlbum} onClose={() => setOpenAlbum(null)} />}
    </section>
  )
})

export default StudiosAlbums
