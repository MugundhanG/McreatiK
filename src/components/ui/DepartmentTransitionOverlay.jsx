/* ============================================
   DepartmentTransitionOverlay
   Full-screen diagonal panel wipe played whenever
   the user switches departments via
   DepartmentSwitcher — covers the screen (showing
   the destination's logo, or its icon when a
   department has no logo mark yet), swaps the route
   behind it, then wipes away to reveal the new page.
   Mounted once in App, driven by the
   departmentTransition pub/sub so any
   DepartmentSwitcher instance can trigger it. Reads
   destinations from the shared DEPARTMENTS array so
   a future department needs no changes here.
   ============================================ */

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { onDepartmentTransition } from '../../utils/departmentTransition'
import { DEPARTMENTS } from '../../utils/departments'

const ENTER_MS = 450
const HOLD_MS = 400
const EXIT_MS = 450

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PANEL_STYLE = { width: '140vw', left: '-20vw', transform: 'skewX(-12deg)' }
const EASE = [0.76, 0, 0.24, 1]

const DepartmentTransitionOverlay = () => {
  const navigate = useNavigate()
  const [run, setRun] = useState(null) // { department, exiting }

  useEffect(() => {
    return onDepartmentTransition(async (department) => {
      setRun({ department, exiting: false })
      await wait(ENTER_MS)
      const dept = DEPARTMENTS.find((d) => d.key === department)
      navigate(dept ? dept.path : '/')
      await wait(HOLD_MS)
      setRun({ department, exiting: true })
      await wait(EXIT_MS)
      setRun(null)
    })
  }, [navigate])

  const dept = run && DEPARTMENTS.find((d) => d.key === run.department)

  return createPortal(
    <AnimatePresence>
      {run && dept && (
        <div className="fixed inset-0 z-[999] overflow-hidden pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute inset-y-0 flex items-center justify-center bg-[#0a0b10]"
            style={PANEL_STYLE}
            initial={{ x: '-100%' }}
            animate={{ x: run.exiting ? '100%' : '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: (run.exiting ? EXIT_MS : ENTER_MS) / 1000, ease: EASE }}
          >
            {dept.logo ? (
              <img
                src={dept.logo}
                alt=""
                style={{ transform: 'skewX(12deg)' }}
                className="h-16 sm:h-20 w-auto object-contain"
              />
            ) : (
              <dept.icon
                style={{ transform: 'skewX(12deg)', color: dept.accent }}
                className="w-14 h-14 sm:w-16 sm:h-16"
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default DepartmentTransitionOverlay
