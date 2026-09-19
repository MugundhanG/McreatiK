/* ============================================
   departments
   Single source of truth for the three McreatiK
   departments (Tech, Studios, Store) that
   DepartmentSwitcher and DepartmentTransitionOverlay
   both render from, instead of each hardcoding its
   own Tech/Studios blocks. Adding a future 4th
   department is just one more entry here.
   ============================================ */

import { FiCode, FiCamera, FiPackage } from 'react-icons/fi'
import techLogo from '../assets/tech-logo-dark-bg.png'
import studiosLogo from '../assets/studios-logo-dark-bg.png'

export const DEPARTMENTS = [
  {
    key: 'tech',
    label: 'Tech',
    fullName: 'McreatiK Tech & Creative',
    path: '/tech',
    icon: FiCode,
    accent: '#1E4FD9',
    logo: techLogo,
  },
  {
    key: 'studios',
    label: 'Studios',
    fullName: 'McreatiK Studios',
    path: '/studios',
    icon: FiCamera,
    accent: '#C9971F',
    logo: studiosLogo,
  },
  {
    key: 'store',
    label: 'Store',
    fullName: 'McreatiK Digital Store',
    path: '/store',
    icon: FiPackage,
    accent: '#8B7FE8',
    // No dedicated Store logo mark yet (the department is still a
    // placeholder) — DepartmentTransitionOverlay falls back to the
    // icon above whenever `logo` is null.
    logo: null,
  },
]
