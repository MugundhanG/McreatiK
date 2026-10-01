/* ============================================
   PackageFinder logic — the questions and the
   scoring, kept apart from the component so the
   component file only exports a component (fast
   refresh) and the rules are easy to test.

   Each answer is scored 0–2: the TECH_PACKAGES
   tier it implies. The recommendation is the
   highest tier any answer needs.
   ============================================ */

export const FINDER_QUESTIONS = [
  {
    id: 'pages',
    question: 'How big is your site?',
    options: ['Up to 5 pages', 'Around 8–10 pages', 'Up to 15 pages'],
  },
  {
    id: 'goal',
    question: 'What matters most?',
    options: ['Look credible & get found', 'Bring in more enquiries', 'A premium, custom feel'],
  },
  {
    id: 'features',
    question: 'Any special features?',
    options: ['No, keep it simple', 'Gallery, FAQ, testimonials', 'Catalogue & advanced forms'],
  },
]

/* Highest tier any answer calls for, or null until something is picked */
export function recommendTier(answers) {
  const picked = Object.values(answers)
  return picked.length ? Math.max(...picked) : null
}
