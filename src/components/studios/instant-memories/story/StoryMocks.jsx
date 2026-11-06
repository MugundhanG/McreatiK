/* ============================================
   StoryMocks — the illustrations beside each
   chapter of the Instant Memories story page.
   Small HTML recreations of the app's screens
   (plus the real couple / viewer / analytics
   screenshots), keyed by the chapter's `mock`.
   ============================================ */

import React from 'react'
import { BsQrCode } from 'react-icons/bs'
import { FiCamera, FiCheck, FiDownload, FiEyeOff, FiInstagram, FiPause, FiPlus, FiWifiOff } from 'react-icons/fi'
import { LivePhone, Phone } from '../Sections'
import { STORY_STUDIO } from '../../../../data/instantMemoriesStory'
import studiosLogoLight from '../../../../assets/studios-logo-light-bg.webp'

const IMG = '/studios/instant-memories'
const LIVE = `${IMG}/live`

/** A light "app window" card with a fake address bar. */
function AppWindow({ url, children, className = '' }) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-white text-[#1C1710] shadow-2xl shadow-black/15 ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#FAF7F0] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#E5484D]/70" />
        <span className="h-2 w-2 rounded-full bg-[#F5A524]/70" />
        <span className="h-2 w-2 rounded-full bg-[#30A46C]/70" />
        <span className="ml-3 min-w-0 truncate rounded-md bg-white px-2 py-0.5 font-mono-label text-[10px] text-[#6B6153]">{url}</span>
      </div>
      {children}
    </div>
  )
}

/** A floating white chip used for small call-outs on a mock. */
function Chip({ children, className = '' }) {
  return (
    <div className={`absolute z-10 flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2 font-body text-xs text-[#1C1710] shadow-xl shadow-black/20 ${className}`}>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="font-body text-[10px] text-[#6B6153]">{label}</p>
      <p className="mt-0.5 rounded-md border border-black/10 px-2 py-1.5 font-body text-xs">{value}</p>
    </div>
  )
}

function NewEventMock() {
  return (
    <div className="relative pb-10 pr-6">
      <AppWindow url="live.mcreatik.com/events/new">
        <div className="space-y-3 p-5">
          <p className="font-body text-sm font-semibold">New event</p>
          <Field label="Event name" value="Meera & Arun’s Wedding" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value="Sat, 23 Jan 2027" />
            <Field label="Studio" value={STORY_STUDIO} />
          </div>
          <div>
            <p className="font-body text-[10px] text-[#6B6153]">Event type</p>
            <div className="mt-1 grid grid-cols-2 gap-1 rounded-lg bg-[#FAF7F0] p-1 font-body text-xs">
              <span className="rounded-md bg-[#1C1710] py-1.5 text-center font-semibold text-white">Main</span>
              <span className="py-1.5 text-center text-[#6B6153]">Quick</span>
            </div>
          </div>
          <span className="inline-block rounded-md bg-[#1C1710] px-3 py-1.5 font-body text-xs font-semibold text-white">Create event</span>
        </div>
      </AppWindow>
      <Chip className="bottom-0 right-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C1710] text-white"><BsQrCode className="h-6 w-6" /></span>
        <span className="leading-tight">
          <span className="flex items-center gap-1 font-semibold"><FiCheck className="h-3 w-3 text-[#30A46C]" /> Event QR ready</span>
          <span className="text-[10px] text-[#6B6153]">Gallery link · poster · cards</span>
        </span>
      </Chip>
    </div>
  )
}

function BoardMock() {
  return (
    <div className="relative flex items-end justify-center gap-4 rounded-2xl bg-gradient-to-br from-[#EFE4D2] to-[#E2D3BB] px-6 pb-6 pt-8 shadow-2xl shadow-black/10">
      {/* 18x24 board */}
      <div className="flex aspect-[3/4] w-44 flex-col items-center rounded-md bg-[#FAF7F0] p-3 text-center shadow-xl shadow-black/20 sm:w-52">
        <img src={studiosLogoLight} alt="" className="h-8 w-auto" />
        <p className="mt-1 font-display italic text-sm text-[#1C1710]">Every moment, live.</p>
        <div className="mt-2 flex w-full flex-1 flex-col items-center justify-center rounded border border-dashed border-[#C9971F]/60 bg-white p-2">
          <p className="font-display text-[11px] leading-tight text-[#1C1710]">Meera & Arun</p>
          <p className="font-body text-[8px] text-[#6B6153]">23 Jan 2027</p>
          <BsQrCode className="mt-1.5 h-10 w-10 text-[#1C1710]" />
        </div>
        <p className="mt-2 font-body text-[7px] tracking-[0.15em] text-[#6B6153]">1 SCAN · 2 WATCH LIVE · 3 SAVE & SHARE</p>
      </div>
      {/* table card */}
      <div className="mb-1 flex aspect-[2/3] w-20 flex-col items-center justify-center rounded bg-white p-2 text-center shadow-lg shadow-black/20 sm:w-24">
        <p className="font-display text-[9px] leading-tight text-[#1C1710]">Meera & Arun</p>
        <BsQrCode className="my-1.5 h-8 w-8 text-[#1C1710]" />
        <p className="font-body text-[7px] leading-tight text-[#6B6153]">Scan to see the photos live</p>
      </div>
      <div className="absolute left-4 top-3 flex gap-1.5 font-body text-[10px]">
        {['Cream', 'Dark', 'White'].map((t, i) => (
          <span key={t} className={`rounded-full px-2 py-0.5 ${i === 0 ? 'bg-[#1C1710] text-white' : 'bg-white/70 text-[#6B6153]'}`}>{t}</span>
        ))}
      </div>
      <span className="absolute right-4 top-3 font-mono-label text-[10px] text-[#6B6153]">18×24 in · 300 dpi</span>
    </div>
  )
}

const CAMERAS = [
  { name: 'Main camera' },
  { name: 'Candid' },
  { name: 'Stage' },
]

function UploaderMock() {
  return (
    <AppWindow url="McreatiK Instant Memories Uploader">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6153]">Event</p>
            <p className="font-body text-sm font-semibold">Meera & Arun’s Wedding</p>
          </div>
          <span className="rounded-full bg-[#30A46C]/10 px-2 py-0.5 font-body text-[10px] font-semibold text-[#30A46C]">Connected</span>
        </div>
        <ul className="mt-4 space-y-2">
          {CAMERAS.map((c) => (
            <li key={c.name} className="flex items-center gap-3 rounded-lg border border-black/5 bg-[#FAF7F0] px-3 py-2">
              <FiCamera className="h-4 w-4 text-[#C9971F]" />
              <span className="flex-1 font-body text-xs font-medium">{c.name}</span>
              <span className="flex items-center gap-1 font-body text-[10px] text-[#30A46C]"><span className="h-1.5 w-1.5 rounded-full bg-[#30A46C]" />Online</span>
            </li>
          ))}
          <li className="flex items-center gap-2 rounded-lg border border-dashed border-black/15 px-3 py-2 font-body text-xs text-[#6B6153]">
            <FiPlus className="h-4 w-4" /> Add camera <span className="ml-auto text-[10px]">3 of 4</span>
          </li>
        </ul>
        <p className="mt-3 font-body text-[10px] text-[#6B6153]">Photos are saved to McreatiK Photos / Meera & Arun / &lt;camera&gt;</p>
      </div>
    </AppWindow>
  )
}

const UPLOADS = [
  { file: 'IMG_4412.JPG', status: 'In gallery · 3 s', ok: true },
  { file: 'IMG_4413.JPG', status: 'In gallery · 4 s', ok: true },
  { file: 'IMG_4414.JPG', status: 'In gallery · 3 s', ok: true },
  { file: 'IMG_4415.JPG', status: 'Waiting for internet · queued', ok: false },
]

function UploadsMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
      <img src={`${LIVE}/p1.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative space-y-2 p-5 sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5484D] px-2.5 py-1 font-body text-[10px] font-bold tracking-wider text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" /> LIVE
        </span>
        {UPLOADS.map((u) => (
          <div key={u.file} className="flex items-center gap-3 rounded-xl bg-white/95 px-3 py-2 font-body text-xs text-[#1C1710] shadow-lg">
            {u.ok ? <FiCheck className="h-4 w-4 text-[#30A46C]" /> : <FiWifiOff className="h-4 w-4 text-[#F5A524]" />}
            <span className="font-mono-label text-[11px]">{u.file}</span>
            <span className={`ml-auto text-[10px] ${u.ok ? 'text-[#6B6153]' : 'text-[#B7791F]'}`}>{u.status}</span>
          </div>
        ))}
        <p className="pt-1 font-body text-[11px] text-white/80">Camera → laptop over Wi-Fi → every guest’s phone</p>
      </div>
    </div>
  )
}

function LivePhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-[250px]">
      <LivePhone />
      <Chip className="-left-16 bottom-24 hidden sm:flex">
        <BsQrCode className="h-5 w-5" /> <span className="font-semibold">Scanned · Table 12</span>
      </Chip>
    </div>
  )
}

function ViewerMock() {
  return (
    <div className="relative mx-auto w-full max-w-[250px]">
      <Phone src={`${IMG}/guest-viewer.jpg`} alt="" />
      <Chip className="-right-10 top-16 hidden sm:flex">
        <FiCheck className="h-4 w-4 text-[#30A46C]" /> <span className="font-semibold">Shared</span>
      </Chip>
    </div>
  )
}

function ControlMock() {
  return (
    <AppWindow url="live.mcreatik.com/events/meera-arun">
      <div className="p-5">
        <p className="font-body text-sm font-semibold">Cameras</p>
        <ul className="mt-3 space-y-2">
          {[
            { name: 'Main camera', note: '412 photos', paused: false },
            { name: 'Candid', note: 'Paused', paused: true },
            { name: 'Stage', note: '188 photos', paused: false },
          ].map((c) => (
            <li key={c.name} className="flex items-center gap-3 rounded-lg border border-black/5 bg-[#FAF7F0] px-3 py-2">
              <FiCamera className="h-4 w-4 text-[#C9971F]" />
              <span className="flex-1 font-body text-xs font-medium">{c.name}</span>
              {c.paused ? (
                <span className="flex items-center gap-1 rounded-full bg-[#F5A524]/15 px-2 py-0.5 font-body text-[10px] font-semibold text-[#B7791F]"><FiPause className="h-3 w-3" /> Paused</span>
              ) : (
                <span className="font-body text-[10px] text-[#6B6153]">{c.note}</span>
              )}
              <span className="rounded-md border border-black/10 px-2 py-0.5 font-body text-[10px]">{c.paused ? 'Resume' : 'Pause'}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#1C1710] px-3 py-2 font-body text-xs text-white">
          <FiEyeOff className="h-4 w-4 text-[#E3C46F]" /> Photo hidden from the gallery
        </div>
      </div>
    </AppWindow>
  )
}

function FollowMock() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] rounded-[2rem] bg-[#1C1710] p-5 shadow-2xl shadow-black/40">
      <div className="overflow-hidden rounded-2xl">
        <img src={`${LIVE}/p4.webp`} alt="" className="aspect-[4/5] w-full object-cover" />
      </div>
      <div className="absolute inset-x-8 top-10 rounded-2xl bg-white p-4 text-center text-[#1C1710] shadow-2xl">
        <p className="font-body text-xs text-[#6B6153]">Photo saved</p>
        <div className="mt-3 flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(45deg,#f09433,#dc2743_50%,#bc1888)] text-white">
            <FiInstagram className="h-5 w-5" />
          </span>
          <span className="font-body text-xs leading-snug">Photos by <b>{STORY_STUDIO}</b>. Follow them on Instagram</span>
        </div>
        <span className="mt-3 block rounded-full bg-[#1C1710] py-2 font-body text-xs font-semibold text-white">Follow</span>
      </div>
    </div>
  )
}

function CoupleMock() {
  return (
    <div className="relative mx-auto w-full max-w-[250px]">
      <Phone src={`${IMG}/couple-portal.jpg`} alt="" />
      <Chip className="-left-14 bottom-20 hidden sm:flex">
        <FiCheck className="h-4 w-4 text-[#30A46C]" /> <span className="font-semibold">Album picks sent to {STORY_STUDIO}</span>
      </Chip>
    </div>
  )
}

function ZipMock() {
  return (
    <AppWindow url="live.mcreatik.com/couple">
      <div className="p-5">
        <p className="font-body text-sm font-semibold">Meera & Arun’s Wedding</p>
        <p className="font-body text-[11px] text-[#6B6153]">Full quality · from {STORY_STUDIO}</p>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {['p1', 'p3', 'p5', 'p7'].map((n) => (
            <img key={n} src={`${LIVE}/${n}.webp`} alt="" className="aspect-square w-full rounded-md object-cover" />
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-black/5 bg-[#FAF7F0] p-3">
          <div className="flex items-center gap-2 font-body text-xs">
            <FiDownload className="h-4 w-4 text-[#C9971F]" /> Preparing your ZIP
            <span className="ml-auto font-semibold tabular-nums">72%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-[72%] rounded-full bg-[#C9971F]" />
          </div>
        </div>
        <div className="mt-3 flex gap-2 font-body text-[11px]">
          <span className="rounded-full bg-[#1C1710] px-3 py-1 text-white">Download all</span>
          <span className="rounded-full border border-black/10 px-3 py-1">Download album picks</span>
        </div>
      </div>
    </AppWindow>
  )
}

function InsightsMock() {
  return (
    <AppWindow url="live.mcreatik.com/events/meera-arun?tab=guests">
      <img src={`${IMG}/studio-analytics.jpg`} alt="" loading="lazy" width="1440" height="900" className="block w-full" />
    </AppWindow>
  )
}

function KeepMock() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-black/5 bg-white p-6 text-[#1C1710] shadow-2xl shadow-black/10">
      <p className="font-body text-sm font-semibold">Meera & Arun’s Wedding</p>
      <p className="mt-1 font-body text-xs text-[#6B6153]">Open until 23 Jul 2027</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className="h-full w-[96%] rounded-full bg-[#C9971F]" />
      </div>
      <p className="mt-2 font-body text-[11px] text-[#6B6153]">3-month period · 6 days left</p>
      <span className="mt-5 block rounded-full bg-[#1C1710] py-2.5 text-center font-body text-xs font-semibold text-white">Keep 3 more months</span>
      <p className="mt-3 text-center font-body text-[11px] text-[#6B6153]">Not kept? It closes, and is deleted 30 days later.</p>
    </div>
  )
}

const MOCKS = {
  newEvent: NewEventMock,
  board: BoardMock,
  uploader: UploaderMock,
  uploads: UploadsMock,
  livePhone: LivePhoneMock,
  viewer: ViewerMock,
  control: ControlMock,
  follow: FollowMock,
  couple: CoupleMock,
  zip: ZipMock,
  insights: InsightsMock,
  keep: KeepMock,
}

export default function StoryMock({ name }) {
  const Mock = MOCKS[name]
  return Mock ? <Mock /> : null
}
