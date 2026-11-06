/* ============================================
   Instant Memories — "How it works" story
   One event told from initial setup to album
   selection for /studios/instant-memories/how-it-works.
   Written for every kind of event; names appear
   only inside the example screens. Every feature
   shown is one the app has today (keep it that
   way when editing).
   ============================================ */

export const STORY_STUDIO = 'Your Studio'

/* Who each chapter is about. Photographer chapters sit text-left,
   guest chapters text-right. */
export const STORY_ROLES = {
  photographer: { label: 'Photographer' },
  guest: { label: 'Guests' },
  couple: { label: 'Couple or family' },
}

export const STORY_ACTS = [
  {
    id: 'before',
    label: 'Act I',
    title: 'Before the event',
    sub: 'Two weeks out, and the hour before the guests arrive.',
    tone: 'light',
    chapters: [
      {
        id: 'create-event',
        who: 'photographer',
        time: 'Mon · 2 weeks before',
        title: ['It starts with', 'one event.'],
        body: 'The photographer creates the event in the studio dashboard as a Main or Quick event: names, date, and the studio’s logo and Instagram already on it. The event comes with its own QR code.',
        tag: 'Events & QR code',
        mock: 'newEvent',
      },
      {
        id: 'board',
        who: 'photographer',
        time: 'Fri · 2 days before',
        title: ['The board goes', 'to the printer.'],
        body: 'Next comes the 18×24 in studio board in Cream, Dark or White, plus the event card for its frame and a small card for every table. All print-ready, with the QR code on each.',
        tag: 'Studio board & table cards',
        mock: 'board',
      },
      {
        id: 'cameras',
        who: 'photographer',
        time: 'Event day · 5:40 AM',
        title: ['One laptop,', 'three cameras.'],
        body: 'At the venue the photographer opens the Instant Memories uploader on a laptop, adds each camera by name and gets a code for it. Up to four cameras can share one laptop.',
        tag: 'Uploader · Windows & Mac',
        mock: 'uploader',
      },
    ],
  },
  {
    id: 'event',
    label: 'Act II',
    title: 'The event day',
    sub: 'The photographer keeps shooting. The guests watch it arrive.',
    tone: 'dark',
    chapters: [
      {
        id: 'upload',
        who: 'photographer',
        time: '7:42 AM',
        title: ['The most precious moment,', 'in seconds.'],
        body: 'Each frame goes from the camera to the laptop over Wi-Fi. The laptop makes a light, sharp copy and uploads it. When the venue’s internet drops, photos wait in the queue and go up the moment it’s back.',
        tag: 'Live upload · offline queue',
        mock: 'uploads',
      },
      {
        id: 'scan',
        who: 'guest',
        time: '7:43 AM',
        title: ['Guests scan the', 'card on their table.'],
        body: 'The gallery opens in their phone’s browser: no app, no sign-up, no name or number. New photos appear on their own while the page is open.',
        tag: 'Live guest gallery',
        mock: 'livePhone',
      },
      {
        id: 'share',
        who: 'guest',
        time: '7:50 AM',
        title: ['Sent to', 'family.'],
        body: 'Guests open a photo and tap Share to send it to family who couldn’t come, or Download to keep it. The studio’s name is on the gallery they share from.',
        tag: 'Save & share',
        mock: 'viewer',
      },
      {
        id: 'pause',
        who: 'photographer',
        time: '8:15 AM',
        title: ['A private moment', 'stays private.'],
        body: 'During a private ritual or moment, the photographer pauses one camera from the dashboard. Nothing it shoots while paused reaches the gallery. A photo better left unseen? Hide it, and it leaves every open gallery at once.',
        tag: 'Pause a camera · hide a photo',
        mock: 'control',
      },
      {
        id: 'follow',
        who: 'guest',
        time: '8:40 AM',
        title: ['And guests find', 'the studio.'],
        body: 'After guests save a photo, the gallery invites them to follow the studio on Instagram. Everyone knows who took the photos.',
        tag: 'Your brand on every phone',
        mock: 'follow',
      },
    ],
  },
  {
    id: 'after',
    label: 'Act III',
    title: 'The days after',
    sub: 'Album selection, the originals, and how the day went.',
    tone: 'cream',
    chapters: [
      {
        id: 'picks',
        who: 'couple',
        time: 'Day 2',
        title: ['Picking the', 'album photos.'],
        body: 'The couple or family log in to their own private gallery, see every photo by moment, and tap to choose album favourites. The photographer sees the picks as they make them.',
        tag: 'Client portal · album picks',
        mock: 'couple',
      },
      {
        id: 'zip',
        who: 'couple',
        time: 'Day 5',
        title: ['Full quality,', 'in one download.'],
        body: 'The photographer adds the edited full-quality photos from the dashboard. The couple or family download everything as a ZIP, or just their picks, and watch the percentage climb.',
        tag: 'Full-quality ZIP downloads',
        mock: 'zip',
      },
      {
        id: 'insights',
        who: 'photographer',
        time: 'A week later',
        title: ['Proof that', 'it worked.'],
        body: 'The dashboard shows how many guests opened the gallery, scanned the QR, viewed, saved and shared photos, hour by hour, and which photos they loved most.',
        tag: 'Guest insights',
        mock: 'insights',
      },
    ],
  },
  {
    id: 'later',
    label: 'Act IV',
    title: 'Three months on',
    sub: 'The gallery’s period ends, on the studio’s terms.',
    tone: 'sage',
    chapters: [
      {
        id: 'keep',
        who: 'photographer',
        time: '3 months later',
        title: ['Keep it open,', 'or let it close.'],
        body: 'Every gallery stays open for three months (about 90 days). The studio can keep it open three more months, paid by the storage it uses. If not, it closes and is deleted 30 days later.',
        tag: '3-month gallery period',
        mock: 'keep',
      },
    ],
  },
]

/* The five main moments, from initial setup to album selection. */
export const STORY_MOMENTS = [
  { chapters: '01 · 02', name: 'Initial setup', body: 'Create the event, get its QR code, and print the studio board and table cards.' },
  { chapters: '03', name: 'Cameras connected', body: 'The uploader on Windows or Mac, up to 4 cameras per laptop.' },
  { chapters: '04 · 05 · 06', name: 'Live on every phone', body: 'Photos reach guests in seconds. They scan, watch, download and share.' },
  { chapters: '07 · 08', name: 'Studio in control', body: 'Pause a camera, hide a photo, and your brand on every phone.' },
  { chapters: '09 – 12', name: 'Album selection', body: 'Album picks, full-quality ZIP downloads, guest insights and 3 months open.' },
]

export const STORY_FAQ = [
  { question: 'Which events is it for?', answer: 'Any event with guests: weddings, receptions, engagements, birthdays, baby showers, traditional functions and corporate events. Quick events cover up to about 300 guests.' },
  { question: 'Do guests need to install anything?', answer: 'No. They scan the QR code and the gallery opens in their phone’s browser, with no sign-up and no name or number asked.' },
  { question: 'How soon do guests see a photo?', answer: 'Usually within seconds to a minute of it being taken. If the venue internet drops, photos wait on the laptop and upload when it’s back.' },
  { question: 'Do my RAW files get uploaded?', answer: 'No. During the event only a light gallery copy is sent. You add full-quality JPEGs for the client from the dashboard later.' },
  { question: 'Is my studio’s branding on everything?', answer: 'Your studio name, logo and Instagram are on the guest gallery, the client’s gallery, the printed board and cards, and the guides you share.' },
  { question: 'Can I stop photos going live during private moments?', answer: 'Yes. Pause a camera from the uploader or the dashboard, and hide or delete any photo; it disappears from every open gallery immediately.' },
]
