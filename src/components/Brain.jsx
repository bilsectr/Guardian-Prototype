import { useMemo, useState } from 'react'
import { KATEGORILER } from '../data/seed.js'
import {
  brainCall,
  SYSTEM_POLITIKA,
  SYSTEM_ANONIM,
  SYSTEM_BOSLUK,
} from '../lib/ai.js'
import { FALLBACK_POLITIKA, FALLBACK_ANONIM, FALLBACK_BOSLUK } from '../data/fallbacks.js'
import { Card, SeviyeBadge, AccentButton } from './ui.jsx'
import { Header } from './Dashboard.jsx'

const YETENEKLER = [
  { id: 'politika', ad: 'Politika Taslağı', ikon: '📝' },
  { id: 'anonim', ad: 'Delil Anonimleştir', ikon: '🕵️' },
  { id: 'bosluk', ad: 'Boşluk Analizi', ikon: '🎯' },
]

const ORNEK_DELIL = `29.07.2026 tarihinde İK biriminde görevli Mehmet Demir (m.demir@ornek-savunma.com.tr) kullanıcısının bilgisayarında şüpheli etkinlik tespit edildi. Kullanıcı 0532 111 22 33 numarasından bilgilendirildi. TCKN 12345678901 olan personelin erişim yetkileri geçici olarak askıya alındı. Olay, Çankaya/Ankara Üniversiteler Mah. No:12 adresindeki merkez ofiste gerçekleşti.

Teknik bulgular:
- Etkilenen sistem: İK-PC-07
- Zararlı uzantı: .locked
- EDR risk skoru: 0.94
- Uygulanan aksiyon: ağ karantinası + oturum sonlandırma
- İlgili SSB kontrolü: 10.1`

export default function Brain({
  kapsamKontroller,
  hedefSeviye,
  setHedefSeviye,
  secilenKontrol,
  setSecilenKontrol,
}) {
  const [yetenek, setYetenek] = useState('politika')

  return (
    <div className="space-y-6">
      <Header
        baslik="BilSec Brain — Yapay Zekâ Ajanı"
        altBaslik="Büyük dil modeli ile canlı üretim · KOBİ ölçeğine uygun, Türkçe çıktı"
        hedefSeviye={hedefSeviye}
        setHedefSeviye={setHedefSeviye}
      />

      <div className="flex gap-2">
        {YETENEKLER.map((y) => (
          <button
            key={y.id}
            onClick={() => setYetenek(y.id)}
            className={
              'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ' +
              (yetenek === y.id
                ? 'border-accent-500 bg-accent-500/15 text-accent-400'
                : 'border-ink-700 text-slate-300 hover:border-ink-600 hover:text-white')
            }
          >
            <span>{y.ikon}</span>
            {y.ad}
          </button>
        ))}
      </div>

      {yetenek === 'politika' && (
        <Politika
          kontroller={kapsamKontroller}
          secilenKontrol={secilenKontrol}
          setSecilenKontrol={setSecilenKontrol}
        />
      )}
      {yetenek === 'anonim' && <Anonim />}
      {yetenek === 'bosluk' && <Bosluk kontroller={kapsamKontroller} />}
    </div>
  )
}

// ---- Kaynak rozeti (canlı / yedek) ----
export function KaynakRozet({ source, model }) {
  if (!source) return null
  const canli = source === 'live'
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        backgroundColor: canli ? '#16c9ac1f' : '#f59e0b1f',
        color: canli ? '#16c9ac' : '#f59e0b',
      }}
      title={canli ? `Model: ${model || 'BilSec Brain'}` : 'API anahtarı yok — gömülü örnek çıktı'}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: canli ? '#16c9ac' : '#f59e0b' }}
      />
      {canli ? `Canlı üretim (${model || 'BilSec Brain'})` : 'Yedek (fallback) çıktı'}
    </span>
  )
}

// Basit markdown → HTML (başlık, kalın, liste) — hafif render.
export function MarkdownView({ text }) {
  const html = useMemo(() => renderMarkdown(text), [text])
  return (
    <div
      className="prose-bilsec space-y-1 text-sm leading-relaxed text-slate-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function LoadingLine() {
  return (
    <div className="flex items-center gap-2 text-sm text-accent-400">
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" />
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" style={{ animationDelay: '0.2s' }} />
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" style={{ animationDelay: '0.4s' }} />
      <span className="ml-2 text-slate-400">BilSec Brain üretiyor…</span>
    </div>
  )
}

// ========== 1) POLİTİKA ==========
function Politika({ kontroller, secilenKontrol, setSecilenKontrol }) {
  const secilebilir = kontroller.filter((k) => k.durum !== 'uygun')
  const aktif =
    secilenKontrol || secilebilir[0] || kontroller[0]

  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)

  async function uret() {
    setYukleniyor(true)
    setCikti(null)
    const prompt = `SSB Siber Hijyen-KOBİ kontrol maddesi:\n${aktif.no} — ${aktif.metin}\n\nKurum: Örnek Savunma Sanayi A.Ş. (savunma tedarikçisi, 42 personel). Bu kontrol için politika/prosedür taslağı üret.`
    const r = await brainCall({
      system: SYSTEM_POLITIKA,
      prompt,
      max_tokens: 1400,
      fallback: FALLBACK_POLITIKA,
    })
    setCikti(r)
    setYukleniyor(false)
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 p-5 lg:col-span-4">
        <div className="text-sm font-semibold text-slate-200">Kontrol Seç</div>
        <p className="mt-1 text-xs text-slate-500">
          Eksik/kısmi kontrollerden biri için Türkçe politika taslağı üretilir.
        </p>
        <div className="mt-4 max-h-[46vh] space-y-1.5 overflow-y-auto pr-1">
          {secilebilir.map((k) => {
            const s = aktif?.no === k.no
            return (
              <button
                key={k.no}
                onClick={() => setSecilenKontrol(k)}
                className={
                  'flex w-full items-start gap-2 rounded-lg border p-2.5 text-left transition ' +
                  (s
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-ink-700 hover:border-ink-600')
                }
              >
                <span className="mt-0.5 shrink-0 font-mono text-[11px] text-slate-400">{k.no}</span>
                <span className="line-clamp-2 flex-1 text-xs text-slate-300">{k.metin}</span>
                <SeviyeBadge seviye={k.seviye} />
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="col-span-12 flex flex-col p-5 lg:col-span-8">
        <div className="flex items-start justify-between gap-4 border-b border-ink-700 pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">{aktif?.no}</span>
              <SeviyeBadge seviye={aktif?.seviye} />
              <span className="text-xs text-slate-500">
                {KATEGORILER.find((c) => c.id === aktif?.kat)?.ad}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-200">{aktif?.metin}</p>
          </div>
          <AccentButton onClick={uret} disabled={yukleniyor} className="shrink-0">
            {yukleniyor ? 'Üretiliyor…' : '🧠 Politika üret'}
          </AccentButton>
        </div>

        <div className="mt-4 min-h-[320px] flex-1">
          {yukleniyor && <LoadingLine />}
          {!yukleniyor && !cikti && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-slate-500">
              <div className="text-4xl">📝</div>
              <p className="mt-3 max-w-sm text-sm">
                "Politika üret" düğmesine basın — seçili kontrol için BilSec Brain, uygulanabilir bir Türkçe
                politika taslağı oluşturacak.
              </p>
            </div>
          )}
          {cikti && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <KaynakRozet source={cikti.source} model={cikti.model} />
                <button
                  onClick={() => navigator.clipboard?.writeText(cikti.text)}
                  className="text-xs text-slate-400 hover:text-accent-400"
                >
                  Kopyala
                </button>
              </div>
              <div className="max-h-[52vh] overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/50 p-4">
                <MarkdownView text={cikti.text} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// ========== 2) ANONİMLEŞTİRME ==========
function Anonim() {
  const [girdi, setGirdi] = useState(ORNEK_DELIL)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)

  async function anonimlestir() {
    setYukleniyor(true)
    setCikti(null)
    const r = await brainCall({
      system: SYSTEM_ANONIM,
      prompt: girdi,
      max_tokens: 1000,
      fallback: FALLBACK_ANONIM,
    })
    setCikti(r)
    setYukleniyor(false)
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 flex flex-col p-5 lg:col-span-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">Delil Metni (girdi)</div>
          <span className="text-xs text-slate-500">KVKK — kişisel veri maskeleme</span>
        </div>
        <textarea
          value={girdi}
          onChange={(e) => setGirdi(e.target.value)}
          className="min-h-[300px] flex-1 resize-none rounded-lg border border-ink-700 bg-ink-900/50 p-4 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-accent-500"
        />
        <AccentButton onClick={anonimlestir} disabled={yukleniyor} className="mt-4">
          {yukleniyor ? 'İşleniyor…' : '🕵️ Kişisel verileri maskele'}
        </AccentButton>
      </Card>

      <Card className="col-span-12 flex flex-col p-5 lg:col-span-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">Anonimleştirilmiş Çıktı</div>
          {cikti && <KaynakRozet source={cikti.source} model={cikti.model} />}
        </div>
        <div className="min-h-[300px] flex-1 rounded-lg border border-ink-700 bg-ink-900/50 p-4">
          {yukleniyor && <LoadingLine />}
          {!yukleniyor && !cikti && (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
              <div className="text-4xl">🔐</div>
              <p className="mt-3 max-w-xs text-sm">
                Ad-soyad, TCKN, e-posta, telefon ve adres maskelenecek; teknik/uyum bilgisi delil
                bütünlüğü için okunur kalacak.
              </p>
            </div>
          )}
          {cikti && (
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
              {highlightMask(cikti.text)}
            </pre>
          )}
        </div>
      </Card>
    </div>
  )
}

// ========== 3) BOŞLUK ANALİZİ ==========
function Bosluk({ kontroller }) {
  const eksikler = kontroller.filter((k) => k.durum === 'eksik' || k.durum === 'kismi')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)

  async function analizEt() {
    setYukleniyor(true)
    setCikti(null)
    const liste = eksikler
      .map((k) => `- ${k.no} (${k.durum}, seviye ${k.seviye}): ${k.metin}`)
      .join('\n')
    const prompt = `Kurum: Örnek Savunma Sanayi A.Ş. (savunma tedarikçisi, 42 personel).\nAşağıdaki eksik/kısmi SSB Siber Hijyen kontrolleri için önceliklendirilmiş aksiyon planı üret:\n\n${liste}`
    const r = await brainCall({
      system: SYSTEM_BOSLUK,
      prompt,
      max_tokens: 1400,
      fallback: FALLBACK_BOSLUK,
    })
    setCikti(r)
    setYukleniyor(false)
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 p-5 lg:col-span-4">
        <div className="text-sm font-semibold text-slate-200">Açık Kontroller</div>
        <p className="mt-1 text-xs text-slate-500">
          {eksikler.length} eksik/kısmi kontrol analiz edilecek.
        </p>
        <div className="mt-4 max-h-[46vh] space-y-1.5 overflow-y-auto pr-1">
          {eksikler.map((k) => (
            <div
              key={k.no}
              className="flex items-start gap-2 rounded-lg border border-ink-700 p-2.5"
            >
              <span className="mt-0.5 shrink-0 font-mono text-[11px] text-slate-400">{k.no}</span>
              <span className="line-clamp-2 flex-1 text-xs text-slate-300">{k.metin}</span>
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: k.durum === 'eksik' ? '#ef4444' : '#f59e0b' }}
              />
            </div>
          ))}
        </div>
        <AccentButton onClick={analizEt} disabled={yukleniyor} className="mt-4 w-full">
          {yukleniyor ? 'Analiz ediliyor…' : '🎯 Aksiyon planı üret'}
        </AccentButton>
      </Card>

      <Card className="col-span-12 p-5 lg:col-span-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">Önceliklendirilmiş Aksiyon Planı</div>
          {cikti && <KaynakRozet source={cikti.source} model={cikti.model} />}
        </div>
        <div className="min-h-[320px]">
          {yukleniyor && <LoadingLine />}
          {!yukleniyor && !cikti && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-slate-500">
              <div className="text-4xl">🎯</div>
              <p className="mt-3 max-w-sm text-sm">
                Eksik kontrolleri BilSec Brain'e gönderin; efor tahminleriyle önceliklendirilmiş bir yol
                haritası üretilsin.
              </p>
            </div>
          )}
          {cikti && (
            <div className="max-h-[56vh] overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/50 p-4">
              <MarkdownView text={cikti.text} />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// ---- yardımcılar ----
function renderMarkdown(md) {
  const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = md.split('\n')
  let html = ''
  let inList = false
  let inOl = false
  const closeLists = () => {
    if (inList) { html += '</ul>'; inList = false }
    if (inOl) { html += '</ol>'; inOl = false }
  }
  for (let raw of lines) {
    let line = raw.trimEnd()
    if (!line.trim()) { closeLists(); continue }
    const inline = (t) =>
      esc(t)
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="rounded bg-ink-700 px-1 text-accent-400">$1</code>')
    if (/^###\s+/.test(line)) { closeLists(); html += `<h3 class="mt-4 text-sm font-bold text-accent-400">${inline(line.replace(/^###\s+/, ''))}</h3>`; continue }
    if (/^##\s+/.test(line)) { closeLists(); html += `<h2 class="mt-4 text-base font-bold text-white">${inline(line.replace(/^##\s+/, ''))}</h2>`; continue }
    if (/^#\s+/.test(line)) { closeLists(); html += `<h1 class="text-lg font-bold text-white">${inline(line.replace(/^#\s+/, ''))}</h1>`; continue }
    const ol = line.match(/^(\d+)\.\s+(.*)/)
    if (ol) { if (!inOl) { closeLists(); html += '<ol class="ml-5 list-decimal space-y-1">'; inOl = true } html += `<li>${inline(ol[2])}</li>`; continue }
    if (/^[-*]\s+/.test(line)) { if (!inList) { closeLists(); html += '<ul class="ml-5 list-disc space-y-1">'; inList = true } html += `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`; continue }
    closeLists()
    html += `<p>${inline(line)}</p>`
  }
  closeLists()
  return html
}

// Maskelenmiş [ETİKET] parçalarını vurgula
function highlightMask(text) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return parts.map((p, i) =>
    /^\[[^\]]+\]$/.test(p) ? (
      <mark
        key={i}
        className="rounded bg-accent-500/25 px-1 font-semibold text-accent-400"
        style={{ color: '#38e1c8' }}
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  )
}
