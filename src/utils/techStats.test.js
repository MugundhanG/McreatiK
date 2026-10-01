import { describe, it, expect } from 'vitest'
import { TECH_STATS } from './constants'
import { DEMO_CONCEPTS, DEMO_INDUSTRIES } from '../data/demoConcepts'

// TECH_STATS is shown as proof on /tech, so it must never drift from the
// showcase it points to.
describe('TECH_STATS', () => {
  it('matches the number of live website concepts', () => {
    expect(TECH_STATS[0].value).toBe(String(DEMO_CONCEPTS.length))
  })

  it('matches the number of industries', () => {
    expect(TECH_STATS[1].value).toBe(String(DEMO_INDUSTRIES.length))
  })
})
