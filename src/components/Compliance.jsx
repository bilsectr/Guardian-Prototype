import { useEffect, useMemo, useState } from 'react'
import { KATEGORILER, DURUMLAR } from '../data/seed.js'
import { kapsamaYuzdesi, durumSayilari } from '../lib/scoring.js'
import { Card, SeviyeBadge, DurumBadge, DirectoryBadge, OlayBadge, AltyapiBadge, AccentButton } from './ui.jsx'
import { Header } from './Dashboard.jsx'

const DURUM_SIRA = ['uygun', 'kismi', 'eksik']

export default function Compliance({
  kapsamKontroller,
  hedefSeviye,
  setHedefSeviye,
  genelSkor,
  durumDegistir,
  politikayaGonder,
  dizinSeti,
  odakKontrol,
  setOdakKontrol,
}) {
  const [aktifKat, setAktifKat] = useState(1)
  const [deliller, setDeliller] = useState(() => new Set())

  function delilToggle(no) {
    setDeliller((prev) => {
      const y = new Set(prev)
      y.has(no) ? y.delete(no) : y.add(no)
      return y
    })
  }

  // Directory'den gelen odak kontrolüne göre kategoriye geç + vurgula
  useEffect(() => {
    if (!odakKontrol) return
    const k = kapsamKontroller.find((c) => c.no === odakKontrol)
    if (k) setAktifKat(k.kat)
    const t = setTimeout(() => setOdakKontrol && setOdakKontrol(null), 2500)
    return () => clearTimeout(t)
  }, [odakKontrol])

  const dizinKapsam = dizinSeti || new Set()

  const katKontroller = useMemo(
    () => kapsamKontroller.filter((k) => k.kat === aktifKat),
    [kapsamKontroller, aktifKat]
  )

  // Kapsam dışı kalan (hedef seviyeye göre) kategorileri de gösterelim ama pasif.
  const katMeta = useMemo(() => {
    return KATEGORILER.map((kat) => {
      const list = kapsamKontroller.filter((k) => k.kat === kat.id)
      return { ...kat, adet: list.length, yuzde: kapsamaYuzdesi(list) }
    })
  }, [kapsamKontroller])

  function sonrakiDurum(mevcut) {
    const i = DURUM_SIRA.indexOf(mevcut)
    return DURUM_SIRA[(i + 1) % DURUM_SIRA.length]
  }

  return (
    <div className="space-y-6">
      <Header
        baslik="BilSec Compass — Uyum"
        altBaslik="SSB Siber Hijyen-KOBİ · 13 kategori · 52 kontrol"
        hedefSeviye={hedefSeviye}
        setHedefSeviye={setHedefSeviye}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-ink-700 bg-ink-850/70 px-5 py-3 text-sm">
        <span className="text-slate-400">Seçili seviyede kapsama:</span>
        <span className="text-lg font-bold text-accent-400">%{genelSkor}</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">{kapsamKontroller.length} kontrol değerlendiriliyor</span>
        {kapsamKontroller.filter((k) => k.kaynak === 'directory').length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300">
            🗄️ {kapsamKontroller.filter((k) => k.kaynak === 'directory').length} kontrol BilSec
            Directory ile otomatik
          </span>
        )}
        {kapsamKontroller.filter((k) => k.kaynak === 'altyapi').length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
            🖥️ {kapsamKontroller.filter((k) => k.kaynak === 'altyapi').length} kontrol Yerinde Altyapı
            ile otomatik
          </span>
        )}
        {kapsamKontroller.filter((k) => k.kaynak === 'olay').length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
            🗂️ {kapsamKontroller.filter((k) => k.kaynak === 'olay').length} kontrol Olay Yönetimi ile
            otomatik
          </span>
        )}
        <span className="ml-auto text-xs text-slate-500">
          Durumu değiştirmek için etikete tıklayın (Uygun → Kısmi → Eksik)
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Kategori listesi */}
        <Card className="col-span-12 overflow-hidden p-2 lg:col-span-4">
          <div className="max-h-[70vh] overflow-y-auto">
            {katMeta.map((kat) => {
              const aktif = aktifKat === kat.id
              const bos = kat.adet === 0
              return (
                <button
                  key={kat.id}
                  disabled={bos}
                  onClick={() => setAktifKat(kat.id)}
                  className={
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ' +
                    (aktif
                      ? 'bg-accent-500/15'
                      : bos
                      ? 'opacity-40'
                      : 'hover:bg-ink-800')
                  }
                >
                  <span className="text-base">{kat.ikon}</span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={
                        'truncate text-sm ' +
                        (aktif ? 'font-semibold text-accent-400' : 'text-slate-200')
                      }
                    >
                      {kat.id}. {kat.ad}
                    </div>
                    {!bos && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-ink-700">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${kat.yuzde}%`,
                              backgroundColor:
                                kat.yuzde >= 80 ? '#16c9ac' : kat.yuzde >= 50 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">%{kat.yuzde}</span>
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-500">{kat.adet}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Kontroller */}
        <Card className="col-span-12 p-5 lg:col-span-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">{KATEGORILER.find((k) => k.id === aktifKat)?.ikon}</span>
            <h2 className="text-base font-semibold">
              {aktifKat}. {KATEGORILER.find((k) => k.id === aktifKat)?.ad}
            </h2>
          </div>

          <div className="space-y-2.5">
            {katKontroller.length === 0 && (
              <div className="rounded-lg border border-dashed border-ink-700 p-6 text-center text-sm text-slate-500">
                Bu kategoride seçili hedef seviye kapsamında kontrol bulunmuyor.
              </div>
            )}
            {katKontroller.map((k) => {
              const dizin = k.kaynak === 'directory'
              const olay = k.kaynak === 'olay'
              const altyapi = k.kaynak === 'altyapi'
              const oto = dizin || olay || altyapi
              const odakli = odakKontrol === k.no
              return (
                <div
                  key={k.no}
                  className={
                    'flex items-start gap-4 rounded-lg border bg-ink-900/40 p-4 transition ' +
                    (odakli
                      ? 'border-sky-400 ring-2 ring-sky-400/40'
                      : dizin
                      ? 'border-sky-500/30'
                      : olay
                      ? 'border-violet-500/30'
                      : altyapi
                      ? 'border-emerald-500/30'
                      : 'border-ink-700')
                  }
                >
                  <span className="mt-0.5 shrink-0 rounded bg-ink-700 px-2 py-1 font-mono text-xs text-slate-300">
                    {k.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-slate-200">{k.metin}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <SeviyeBadge seviye={k.seviye} />
                      {dizin && <DirectoryBadge />}
                      {altyapi && <AltyapiBadge />}
                      {olay && <OlayBadge />}
                      {!oto && (
                        <button
                          onClick={() => durumDegistir(k.no, sonrakiDurum(k.durum))}
                          title="Durumu değiştir"
                          className="transition hover:scale-105"
                        >
                          <DurumBadge durum={k.durum} />
                        </button>
                      )}
                      {!oto && (
                        <button
                          onClick={() => delilToggle(k.no)}
                          className={
                            'rounded-md border px-2.5 py-1 text-[11px] transition ' +
                            (deliller.has(k.no)
                              ? 'border-accent-600/50 bg-accent-500/10 text-accent-400'
                              : 'border-ink-600 text-slate-400 hover:border-slate-500 hover:text-slate-200')
                          }
                        >
                          {deliller.has(k.no) ? '✓ Delil eklendi' : '+ Delil ekle'}
                        </button>
                      )}
                      {!oto && (k.durum === 'eksik' || k.durum === 'kismi') && (
                        <button
                          onClick={() => politikayaGonder(k)}
                          className="rounded-md border border-accent-600/50 bg-accent-500/10 px-2.5 py-1 text-[11px] font-medium text-accent-400 transition hover:bg-accent-500/20"
                        >
                          🧠 Politika üret
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
