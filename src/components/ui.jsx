import { SEVIYELER, DURUMLAR } from '../data/seed.js'

export function Card({ children, className = '' }) {
  return (
    <div
      className={
        'rounded-xl border border-ink-700 bg-ink-850/70 backdrop-blur-sm shadow-lg shadow-black/20 ' +
        className
      }
    >
      {children}
    </div>
  )
}

export function SeviyeBadge({ seviye }) {
  const s = SEVIYELER[seviye]
  if (!s) return null
  return (
    <span
      className="inline-flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-[11px] font-bold"
      style={{ backgroundColor: s.renk + '22', color: s.renk, border: `1px solid ${s.renk}55` }}
      title={s.ad}
    >
      {s.kod}
    </span>
  )
}

export function DurumBadge({ durum }) {
  const d = DURUMLAR[durum]
  if (!d) return null
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: d.renk + '1f', color: d.renk }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.renk }} />
      {d.ad}
    </span>
  )
}

// Dizin (BilSec Directory) kaynaklı otomatik "Uygun" rozeti
export function DirectoryBadge({ compact = false }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: '#38bdf81f', color: '#7dd3fc', border: '1px solid #38bdf855' }}
      title="Bu kontrol BilSec Directory politikalarıyla otomatik karşılanıyor"
    >
      <span>🗄️</span>
      {compact ? 'Uygun' : 'Uygun · Kaynak: Directory'}
    </span>
  )
}

// Olay Yönetimi kaynaklı otomatik "Uygun" rozeti
export function OlayBadge({ compact = false }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: '#a78bfa1f', color: '#c4b5fd', border: '1px solid #a78bfa55' }}
      title="Bu kontrol kapatılmış siber olay vakalarıyla besleniyor"
    >
      <span>🗂️</span>
      {compact ? 'Uygun' : 'Uygun · Kaynak: Olay Yönetimi'}
    </span>
  )
}

// Yerinde Altyapı (BilSec Edge) kaynaklı otomatik "Uygun" rozeti
export function AltyapiBadge({ compact = false }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: '#34d3991f', color: '#6ee7b7', border: '1px solid #34d39955' }}
      title="Bu kontrol yerinde altyapı servisleriyle otomatik karşılanıyor"
    >
      <span>🖥️</span>
      {compact ? 'Uygun' : 'Uygun · Kaynak: Yerinde Altyapı'}
    </span>
  )
}

// Renk kodlu genel etiket (önem / durum vb.)
export function Pill({ ad, renk, dot = true }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ backgroundColor: renk + '1f', color: renk }}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: renk }} />}
      {ad}
    </span>
  )
}

// Kapsama halkası (SVG)
export function CoverageRing({ yuzde, size = 160, stroke = 14, renk = '#16c9ac' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (yuzde / 100) * c
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2b4a" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={renk}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#e6edf7"
        fontSize={size * 0.24}
        fontWeight="700"
      >
        %{yuzde}
      </text>
      <text
        x="50%"
        y="63%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#7d8bab"
        fontSize={size * 0.09}
      >
        kapsama
      </text>
    </svg>
  )
}

export function Stat({ label, value, sub, renk = '#e6edf7' }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <span className="mt-1 text-2xl font-bold" style={{ color: renk }}>
        {value}
      </span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  )
}

export function AccentButton({ children, onClick, disabled, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        'inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50 ' +
        className
      }
    >
      {children}
    </button>
  )
}
