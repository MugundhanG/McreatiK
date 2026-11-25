/* ============================================
   Instant Memories — page content
   Copy for /studios/instant-memories: what the
   live wedding gallery does for studios, couples
   and guests, plus the public FAQ. Every claim
   matches what the app does today; keep it that
   way when editing (McreatiK's internal Q&A sheet
   has the full answers).
   ============================================ */

export const IM_DEMO_MESSAGE =
  "Hi McreatiK, I'm a photographer and I'd like to try Instant Memories free at my next wedding."

export const IM_STEPS = [
  {
    title: 'Shoot as usual',
    body: 'Your camera sends each photo over Wi-Fi to a laptop running the Instant Memories uploader for Windows or Mac. Up to 4 cameras can share one laptop.',
  },
  {
    title: 'It appears in seconds',
    body: 'The laptop makes a light, sharp copy and uploads it. Weak venue internet? Photos wait safely in the queue and go up when the connection returns.',
  },
  {
    title: 'Guests scan, and watch',
    body: 'A QR poster at the entrance and on the tables opens your gallery on their phones. No app, no sign-up — new photos simply appear.',
  },
]

export const IM_FOR_STUDIOS = [
  { title: 'Your brand on every phone', body: 'Your studio name, logo and Instagram on the gallery, so every guest sees who took the photos. Your logo is also on every photo guests download or share (you can switch it off per event).' },
  { title: 'Find my photos', body: 'Guests take one selfie and see only their own photos. Optional private gallery.' },
  { title: 'Print-ready board and table cards', body: 'Download an 18×24 in studio board in Cream, Dark or White, plus event and table cards with the QR code, ready for the printer.' },
  { title: 'Built for real venues', body: 'Up to 4 cameras on one laptop, an offline queue for bad Wi-Fi and duplicates skipped. Pause a camera for private moments.' },
  { title: 'You stay in control', body: "Hide, delete or like photos, one or many at once, and guests' phones update instantly. Add photos from your computer too." },
  { title: 'Album selection, sorted', body: 'Give the couple their own login. They pick album photos, you see the picks live and download them as a ZIP.' },
  { title: 'Client galleries without a live event', body: 'Just delivering photos? Create a private, branded client gallery for the couple to pick album photos and download.' },
  { title: 'Guides with your logo', body: 'Ready-made guides for your couples and guests, with your studio name and logo, to share as a PDF.' },
  { title: 'Proof that it worked', body: 'See how many guests opened the gallery, scanned the QR, viewed, saved and shared photos — and which ones they loved most. Download a one-page guest report as an image or PDF to send the couple.' },
]

export const IM_FOR_COUPLES = [
  { title: 'Your own private login', body: 'All your photos in one place, organised by moment. Install it on your phone like an app.' },
  { title: 'Pick your album photos', body: 'Tap to choose favourites for your album. Your photographer sees your picks straight away — no spreadsheets of file numbers.' },
  { title: 'Full-quality downloads', body: 'Download single photos or everything as a ZIP, including the full-quality originals your studio uploads.' },
  { title: 'Guests find their own photos', body: 'With Find my photos, relatives take one selfie and see just the photos they are in.' },
  { title: 'Family sees it on the day', body: "Relatives who couldn't stand close to the stage see the moments live on their phones." },
]

export const IM_FOR_GUESTS = [
  { title: 'Scan and open', body: 'Point your phone camera at the QR code. The gallery opens in your browser — nothing to install, no name or number asked.' },
  { title: 'Watch it live', body: 'New photos appear on their own while the page is open — no refreshing.' },
  { title: 'Find my photos', body: 'Take one selfie in the gallery and see only the photos you are in, with new ones added as they arrive.' },
  { title: 'Save and share', body: 'Download your favourite photos in one tap, or share them straight to family from your phone.' },
  { title: 'Your privacy respected', body: 'Location is removed from every photo, and anyone can ask for a photo of them to be taken down.' },
]

export const IM_PRIVACY = [
  'Galleries open only with their link or QR code, end in 10 random characters and are hidden from Google.',
  'Location (GPS) data is removed from every photo guests see.',
  'Full-quality originals are private: only the couple and the studio can download them, through links that expire.',
  'Guests never sign up: we collect no names, phone numbers or emails.',
  'Anyone can request a photo removal; we aim to take it down within 3 working days, and the studio can hide it instantly.',
  'Find my photos is optional. Guests agree before taking a selfie, face data is processed in India only to match photos at that event, and it is deleted with the gallery.',
  'Photos are stored with Cloudflare and data with Supabase, encrypted.',
  'Galleries stay open for 3 months, about 90 days (longer only if the studio extends them) and are deleted permanently 30 days after they close.',
]

export const IM_FAQ_TABS = ['Studios', 'Couples', 'Guests']

export const IM_FAQ = [
  /* Studios */
  { tab: 'Studios', question: 'Which cameras work?', answer: 'Any camera with FTP transfer over Wi-Fi (for example the Canon EOS R6 Mark II). The uploader can also watch a folder, such as a card-reader or tethering folder.' },
  { tab: 'Studios', question: 'Can several photographers upload to one event?', answer: 'Yes. One laptop handles up to 4 cameras, and you can add more laptops. The dashboard shows each camera by name, whether it is online and how many photos it sent.' },
  { tab: 'Studios', question: 'Can I stop a camera during private moments?', answer: 'Yes. Pause a camera from the uploader or the dashboard; nothing it shoots while paused goes to the gallery.' },
  { tab: 'Studios', question: 'What if the venue internet drops?', answer: 'Nothing is lost. Every photo is saved to the laptop’s queue first and uploads when the connection returns; guests’ phones catch up automatically.' },
  { tab: 'Studios', question: 'Do my RAW files get uploaded?', answer: 'No. During the event only a light gallery copy is sent, so it stays fast. You can add full-quality JPEG originals from the dashboard later for the couple.' },
  { tab: 'Studios', question: 'Can I remove a photo from guests’ phones?', answer: 'Yes. Hide or delete it and it disappears from every open gallery immediately — one photo or many at once.' },
  { tab: 'Studios', question: 'Who owns the photos?', answer: 'You and your couple. We only store and show them for your event; we don’t use them for anything else, show ads or sell data.' },
  { tab: 'Studios', question: 'Can guests find their own photos?', answer: 'Yes, with Find my photos. A guest takes one selfie and sees only the photos they’re in, and new ones appear by themselves. ₹499 per Main event, ₹299 per Quick event, or with a monthly pack. Face data is processed in India and deleted with the gallery.' },
  { tab: 'Studios', question: 'Is my logo on the photos guests share?', answer: 'Yes. Every photo guests download or share carries your logo in the corner. You can switch it off for any event. Your couple’s full-quality photos are never marked.' },
  { tab: 'Studios', question: 'How long are photos kept?', answer: 'Each gallery stays open for 3 months (about 90 days). Keep it 3 more months at ₹15 per GB a month (₹45 per GB stored); otherwise it closes and its photos are deleted 30 days later.' },
  { tab: 'Studios', question: 'How much does it cost?', answer: 'A Main event (weddings, receptions, big events) is ₹2,499 and a Quick event (up to about 300 guests) is ₹1,499. Monthly packs start at ₹2,499 for 2 events, and unused events carry over one month. Need more events in a month? Extras cost less on a pack: from ₹799.' },
  { tab: 'Studios', question: 'How do I pay?', answer: 'From your dashboard: scan the UPI QR, pay, and enter the UPI transaction ID. Your events are added straight away, and we confirm the payment within a day.' },
  /* Couples */
  { tab: 'Couples', question: 'How do we get our photos?', answer: 'Your photographer sends you a private login. You see every photo by moment, pick album favourites and download full quality. For help with your login, ask your photographer.' },
  { tab: 'Couples', question: 'Can both of us use the login?', answer: 'Yes — one login for the two of you, on as many phones as you like.' },
  { tab: 'Couples', question: 'Can we download everything at once?', answer: 'Yes, as ZIP files: everything, a category, or just the photos you select.' },
  { tab: 'Couples', question: 'Who else can see our photos?', answer: 'Guests with your QR code see the gallery versions. Only you and your studio can open your login and the full-quality originals.' },
  { tab: 'Couples', question: 'Can we have Instant Memories at our wedding?', answer: 'Yes — book McreatiK Studios for your wedding and ask for Instant Memories, or ask your own photographer to contact us.' },
  /* Guests */
  { tab: 'Guests', question: 'Do I need an app?', answer: 'No. Scan the QR code and the gallery opens in your phone’s browser. No sign-up, no name or number.' },
  { tab: 'Guests', question: 'How soon do photos appear?', answer: 'Usually within seconds to a minute of being taken. Keep the page open and new photos appear on their own.' },
  { tab: 'Guests', question: 'Can I save or share photos?', answer: 'Yes. Open a photo and tap Download to save it, or Share to send it from your phone. On some iPhones, press and hold the photo and tap “Save image”.' },
  { tab: 'Guests', question: 'I’m in a photo and want it removed.', answer: 'Open the photo and tap “Request removal”, or email connect@mcreatik.com with the gallery link. We pass it to the studio and aim to remove it within 3 working days.' },
]

/* Prices as the app charges them today (im-api.mcreatik.com/api/public/pricing).
   Update these whenever the app's billing settings change. */
export const IM_PRICING_URL = 'https://live.mcreatik.com/pricing'
export const IM_PRICES = [
  { name: 'Main event', price: '₹2,499', unit: 'per event', body: 'Weddings, receptions, big birthdays and large events.' },
  { name: 'Quick event', price: '₹1,499', unit: 'per event', body: 'Engagements, small birthdays and baby showers, up to about 300 guests.' },
  { name: 'Monthly packs', price: 'from ₹2,499', unit: 'per month', body: '2 or 4 events a month. Need more? Extra events from ₹799 while your pack is active. Unused events carry over one month.' },
  { name: 'Client gallery', price: '₹250', unit: 'setup + ₹15 per GB a month', body: 'A private branded gallery to deliver photos, without a live event.' },
  { name: 'Find my photos', price: '₹499', unit: 'per Main event (₹299 per Quick event)', body: 'AI face search for guests. With a monthly pack: Main 2 ₹3,999 · Main 4 ₹5,999 · Quick 2 ₹2,999 · Quick 4 ₹4,999 a month.' },
]
export const IM_PRICE_NOTES = [
  'Every Main event includes 25 GB of storage and every Quick event 10 GB, enough for a full wedding. More is ₹15 per GB a month. Galleries stay open 3 months (about 90 days).',
  'Pay by UPI from your dashboard, with no extra fee.',
]

/* "The old way vs Instant Memories" rows for the SaaS landing page. */
export const IM_PROBLEMS = [
  { problem: 'Guests wait weeks.', problemBody: 'By the time photos arrive, the excitement is over.', fix: 'Photos on every phone in seconds.', fixBody: 'Guests see them while the event is still going on.' },
  { problem: 'Your work is invisible.', problemBody: 'Guests share blurry phone shots on WhatsApp, with no credit to the studio.', fix: 'Your logo on every photo they share.', fixBody: 'Every photo guests download or send on WhatsApp carries your studio’s logo, so each share advertises you.' },
  { problem: '“Send me my photos.”', problemBody: 'After every wedding, guests call and message for weeks asking for their photos.', fix: 'They find their own.', fixBody: 'One selfie shows each guest only the photos they’re in.' },
  { problem: 'Album selection is a mess.', problemBody: 'File numbers sent on WhatsApp, spreadsheets, back-and-forth for days.', fix: 'The couple pick in their own gallery.', fixBody: 'You see every pick as they make it.' },
  { problem: 'Delivery by pen drive or Drive link.', problemBody: 'Unbranded, hard to download, and links get forwarded anywhere.', fix: 'A private, branded gallery.', fixBody: 'Full-quality ZIP downloads in one tap.' },
  { problem: 'Venue Wi-Fi lets you down.', problemBody: 'Uploading on the day feels too risky.', fix: 'Nothing is lost.', fixBody: 'Photos wait on the laptop and upload when the internet is back.' },
  { problem: 'Privacy worries.', problemBody: 'Families don’t want photos public or searchable.', fix: 'Only people with the QR code see them.', fixBody: 'Hidden from Google, with location removed and photo removal on request.' },
]

/* "Find my photos" (AI face search) section of the SaaS landing page. */
export const IM_FIND_POINTS = [
  'One selfie, then it keeps finding: new photos of them appear on their own.',
  'Private gallery option: guests see only their own photos, never the whole event. Ideal for families who value privacy.',
  'Safe: face data is used only to match photos at that event, processed in India, and deleted with the gallery.',
]
export const IM_FIND_PRICE = '₹499 per Main event · ₹299 per Quick event, or included with a monthly pack from ₹2,999 a month.'

export const IM_APP_URL = 'https://live.mcreatik.com'

/* Site paths for the Instant Memories SaaS pages. */
export const IM_HOME = '/instant-memories'
export const IM_HOW = '/instant-memories/how-it-works'
