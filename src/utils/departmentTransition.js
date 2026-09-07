/* ============================================
   departmentTransition
   Tiny pub/sub so DepartmentSwitcher (rendered in
   several navbars/footers) can trigger the single
   DepartmentTransitionOverlay mounted once in App,
   without threading props or context through the
   whole tree.
   ============================================ */

let listeners = []

export function onDepartmentTransition(callback) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((l) => l !== callback)
  }
}

export function triggerDepartmentTransition(department) {
  listeners.forEach((callback) => callback(department))
}
