/** Small engineering annotations, one per principle (generic illustrations, not claims). */
export function PrincipleVisual({ kind }: { kind: number }) {
  if (kind === 0) return (
    <pre className="pv pv-code" aria-hidden="true">{`const result = await api.request(input)
if (!result.ok) {
  return handleError(result)
}
return render(result.data)`}</pre>
  )
  if (kind === 1) return (
    <svg className="pv" viewBox="0 0 220 130" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      {[15, 40, 65, 90, 115].map((y, i) => <path key={i} d={`M4 ${y} C70 ${y} 80 65 150 65`} className={i === 2 ? 'pv-hot' : ''} />)}
      <rect x="150" y="45" width="62" height="40" className="pv-hot" />
      <text x="4" y="10" className="pv-t">workflow</text><text x="156" y="102" className="pv-t">interface</text>
    </svg>
  )
  if (kind === 2) return (
    <svg className="pv" viewBox="0 0 220 130" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M40 30 H110 M110 30 V65 M40 100 H110 M110 100 V65 M110 65 H170" />
      {[[40, 30, 'client'], [40, 100, 'auth'], [110, 65, 'api'], [170, 65, 'data']].map(([x, y, l]) => (
        <g key={String(l)}><circle cx={x as number} cy={y as number} r="7" className="pv-hot" /><text x={(x as number) - 14} y={(y as number) - 12} className="pv-t">{l}</text></g>
      ))}
    </svg>
  )
  return (
    <svg className="pv" viewBox="0 0 220 130" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M40 40 H180 V90 H40 Z" strokeDasharray="4 5" />
      <path d="M170 34 L180 40 L170 46" className="pv-hot" /><path d="M50 84 L40 90 L50 96" className="pv-hot" />
      <text x="48" y="32" className="pv-t">build → test</text><text x="110" y="112" className="pv-t">refine ←</text>
    </svg>
  )
}
