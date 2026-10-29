/** Custom cartoon drawing hand. The pen tip sits at (0,0) so it can be positioned on the stroke end. */
export function HandIllustration() {
  return (
    <g className="hand" aria-hidden="true">
      <path d="M0 0 L30 -50" stroke="#F04B32" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 0 L3 -5" stroke="#F3F0E9" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 -38 C24 -66 62 -80 80 -60 C94 -42 82 -14 54 -14 C38 -14 28 -22 20 -38 Z" fill="#F3F0E9" stroke="#050505" strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 -48 C46 -40 54 -38 62 -42 M46 -32 C52 -26 60 -26 68 -30" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 -40 C14 -46 12 -34 24 -30" fill="#F3F0E9" stroke="#050505" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}
