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
  "Hi McreatiK, I'm a photographer and I'd like a demo of Instant Memories, the live wedding gallery."
export const IM_COUPLE_MESSAGE =
  "Hi McreatiK, we're getting married and we'd like Instant Memories (the live photo gallery) at our wedding."

export const IM_STEPS = [
  {
    title: 'Shoot as usual',
    body: "Your camera sends each photo over Wi-Fi to a laptop running the Instant Memories uploader. More than one camera? Add one uploader each.",
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
  { title: 'Your brand on every phone', body: 'Your studio name, logo and Instagram on the gallery and the printed QR poster. Every guest sees who took the photos.' },
  { title: 'Live during the event', body: 'Photos reach guests while the event is still happening, not weeks later. It is the moment people talk about.' },
  { title: 'Built for real venues', body: 'Several cameras at once, an offline queue for bad Wi-Fi, duplicates skipped automatically.' },
  { title: 'You stay in control', body: "Hide, delete or like photos and they update on guests' phones instantly. Sort photos into albums like Couple, Rituals and Candid." },
  { title: 'Album selection, sorted', body: "Give the couple their own login. They pick album photos, you see the picks live and download them as a ZIP." },
  { title: 'Proof that it worked', body: 'See how many guests opened the gallery, scanned the QR, viewed and saved photos — and which photos they loved most.' },
]

export const IM_FOR_COUPLES = [
  { title: 'Your own private login', body: 'All your photos in one place, organised by moment. Install it on your phone like an app.' },
  { title: 'Pick your album photos', body: 'Tap to choose favourites for your album. Your photographer sees your picks straight away — no spreadsheets of file numbers.' },
  { title: 'Full-quality downloads', body: 'Download single photos or everything as a ZIP, including the full-quality originals your studio uploads.' },
  { title: 'Family sees it on the day', body: "Relatives who couldn't stand close to the stage see the moments live on their phones." },
]

export const IM_FOR_GUESTS = [
  { title: 'Scan and open', body: 'Point your phone camera at the QR code. The gallery opens in your browser — nothing to install, no name or number asked.' },
  { title: 'Watch it live', body: 'New photos appear on their own while the page is open — no refreshing.' },
  { title: 'Save and share your favourites', body: 'Download your favourite photos in one tap, or share them straight to WhatsApp and Instagram with the studio credited.' },
  { title: 'Your privacy respected', body: 'Location is removed from every photo, and anyone can ask for a photo of them to be taken down.' },
]

export const IM_PRIVACY = [
  'Galleries open only with their link or QR code, end in 10 random characters and are hidden from Google.',
  'Location (GPS) data is removed from every photo guests see.',
  'Full-quality originals are private: only the couple and the studio can download them, through links that expire.',
  'Guests never sign up: we collect no names, phone numbers or emails.',
  'Anyone can request a photo removal; we aim to take it down within 3 working days, and the studio can hide it instantly.',
  'Photos are stored with Cloudflare and data with Supabase, encrypted, and deleted on the date the studio sets.',
]

export const IM_FAQ_TABS = ['Studios', 'Couples', 'Guests']

export const IM_FAQ = [
  /* Studios */
  { tab: 'Studios', question: 'Which cameras work?', answer: 'Any camera with FTP transfer over Wi-Fi (for example the Canon EOS R6 Mark II). The uploader can also watch a folder, such as a card-reader or tethering folder.' },
  { tab: 'Studios', question: 'Can several photographers upload to one event?', answer: 'Yes. Add one uploader per camera or laptop; the dashboard shows which cameras are online and how many photos each one sent.' },
  { tab: 'Studios', question: 'What if the venue internet drops?', answer: 'Nothing is lost. Every photo is saved to the laptop’s queue first and uploads when the connection returns; guests’ phones catch up automatically.' },
  { tab: 'Studios', question: 'Do my RAW files get uploaded?', answer: 'No. During the event only a light gallery copy is sent, so it stays fast. You can add full-quality JPEG originals from the dashboard later for the couple.' },
  { tab: 'Studios', question: 'Can I remove a photo from guests’ phones?', answer: 'Yes. Hide or delete it and it disappears from every open gallery immediately — one photo or many at once.' },
  { tab: 'Studios', question: 'Who owns the photos?', answer: 'You and your couple. We only store and show them for your event; we don’t use them for anything else, show ads or sell data.' },
  { tab: 'Studios', question: 'How long are photos kept?', answer: 'Until the delete date you set for each event (by default 90 days after the event). Deleting an event removes its photos permanently.' },
  { tab: 'Studios', question: 'How much does it cost?', answer: 'It depends on how many events you shoot — there is per-event pricing and a monthly package. Message us for a quick demo and a quote for your volume.' },
  /* Couples */
  { tab: 'Couples', question: 'How do we get our photos?', answer: 'Your photographer sends you a private login. You see every photo by moment, pick album favourites and download full quality.' },
  { tab: 'Couples', question: 'Can both of us use the login?', answer: 'Yes — one login for the two of you, on as many phones as you like.' },
  { tab: 'Couples', question: 'Can we download everything at once?', answer: 'Yes, as ZIP files: everything, a category, or just the photos you select.' },
  { tab: 'Couples', question: 'Who else can see our photos?', answer: 'Guests with your QR code see the gallery versions. Only you and your studio can open your login and the full-quality originals.' },
  { tab: 'Couples', question: 'Can we have Instant Memories at our wedding?', answer: 'Yes — book McreatiK Studios for your wedding and ask for Instant Memories, or ask your own photographer to contact us.' },
  /* Guests */
  { tab: 'Guests', question: 'Do I need an app?', answer: 'No. Scan the QR code and the gallery opens in your phone’s browser. No sign-up, no name or number.' },
  { tab: 'Guests', question: 'How soon do photos appear?', answer: 'Usually within seconds to a minute of being taken. Keep the page open and new photos appear on their own.' },
  { tab: 'Guests', question: 'Can I save and share photos?', answer: 'Yes — open a photo and tap Download to keep it, or Share to send it to WhatsApp or Instagram. Only the photo is shared, never the gallery link, so the gallery stays private.' },
  { tab: 'Guests', question: 'I’m in a photo and want it removed.', answer: 'Open the photo and tap “Request removal”, or email connect@mcreatik.com with the gallery link. We aim to remove it within 3 working days.' },
]
