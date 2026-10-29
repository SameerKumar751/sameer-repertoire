import { smoothPath } from '../../lib/curve'

const P1 = smoothPath([[-20, 220], [240, 190], [520, 260], [800, 200], [1100, 250], [1460, 210]])
const P2 = smoothPath([[-20, 640], [300, 610], [620, 690], [940, 640], [1240, 600], [1460, 650]])

/** Low-contrast technical ambience: fine grid and two slow neutral data-flow paths (the orange thread lives only in the rail). Purely decorative. */
export function PrinciplesBackdrop() {
  return (
    <svg className="pr-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="pr-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="currentColor" strokeWidth="1" /></pattern>
      </defs>
      <rect width="1440" height="900" fill="url(#pr-grid)" className="pr-grid" />
      <path d={P1} className="pr-flow" /><path d={P2} className="pr-flow pr-flow-b" />
    </svg>
  )
}
