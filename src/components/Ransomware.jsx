import { useEffect, useRef, useState } from 'react'
import { YEDEKLEME, ALARM, IZOLASYON_ADIMLARI } from '../data/seed.js'
import { Card, Stat, AccentButton } from './ui.jsx'
import { Header } from './Dashboard.jsx'

export default function Ransomware({ someYeGit }) {
  const [durum, setDurum] = useState('idle') // idle | calisiyor | tamam
  const [gecen, setGecen] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])

  function baslat() {
    setDurum('calisiyor')
    setGecen(0)
    clearInterval(timerRef.current)
    const t0 = Date.now()
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - t0) / 100) // 10x hızlandırılmış: 60sn → 6sn
      setGecen(s)
      if (s >= 60) {
        clearInterval(timerRef.current)
        setDurum('tamam')
        setGecen(60)
      }
    }, 100)
  }

  function sifirla() {
    clearInterval(timerRef.current)
    setDurum('idle')
    setGecen(0)
  }

  const tamamlanan = IZOLASYON_ADIMLARI.filter((a) => gecen >= a.t)
  const ilerleme = Math.min(100, Math.round((gecen / 60) * 100))

  return (
    <div className="space-y-6">
      <Header
        baslik="Fidye Yazılımı Koruması"
        altBaslik="Immutable yedekleme · restore hazırlığı · otomatik müdahale simülasyonu"
      />

      {/* Yedekleme durumu */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 p-6 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">Yedekleme Duruşu</div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-accent-400">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" />
              Immutable koruma aktif
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat
              label="Kapsanan Sistem"
              value={`${YEDEKLEME.kapsananSistem}/${YEDEKLEME.toplamSistem}`}
              sub="kritik sistem"
              renk="#16c9ac"
            />
            <Stat label="RTO Taahhüdü" value={YEDEKLEME.rtoTaahhut} sub={`RPO: ${YEDEKLEME.rpo}`} />
            <Stat label="Son Yedek" value="Bugün" sub={YEDEKLEME.sonYedek} renk="#16c9ac" />
            <Stat
              label="Son Restore Testi"
              value={YEDEKLEME.sonRestoreSonuc}
              sub={YEDEKLEME.sonRestoreTesti}
              renk="#16c9ac"
            />
          </div>
          <div className="mt-5 rounded-lg border border-ink-700 bg-ink-900/40 p-3 text-xs text-slate-400">
            <span className="text-slate-300">Saklama konumu:</span> {YEDEKLEME.saklamaKonumu} ·
            SSB 7.1 / 7.2 kapsamında harici altyapıda güvenli tutuluyor.
          </div>
        </Card>

        <Card className="col-span-12 flex flex-col items-center justify-center p-6 lg:col-span-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Genel Direnç</div>
          <div className="my-3 text-5xl font-bold text-accent-400">A−</div>
          <div className="text-center text-xs text-slate-500">
            Immutable yedek + hızlı restore + otomatik izolasyon ile fidye yazılımı direnci yüksek.
          </div>
        </Card>
      </div>

      {/* Alarm + izolasyon simülasyonu */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-xl">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-400">
                  {ALARM.siddet}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{ALARM.id}</span>
                <span className="text-[11px] text-slate-500">{ALARM.zaman}</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{ALARM.baslik}</div>
              <div className="mt-0.5 text-xs text-slate-400">
                Varlık: <span className="text-slate-200">{ALARM.varlik}</span> · Kullanıcı:{' '}
                <span className="text-slate-200">{ALARM.kullanici}</span>
              </div>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
                {ALARM.aciklama}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {durum !== 'idle' && (
              <button
                onClick={sifirla}
                className="rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500"
              >
                Sıfırla
              </button>
            )}
            <AccentButton onClick={baslat} disabled={durum === 'calisiyor'}>
              {durum === 'idle' && '🛡️ Otomatik izolasyonu başlat'}
              {durum === 'calisiyor' && 'İzolasyon çalışıyor…'}
              {durum === 'tamam' && '✓ İzolasyon tamamlandı — tekrar çalıştır'}
            </AccentButton>
          </div>
        </div>

        {durum !== 'idle' && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Müdahale zaman çizelgesi</span>
              <span>
                {gecen}s / 60s · {ilerleme}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-700">
              <div
                className="h-full rounded-full bg-accent-500 transition-all"
                style={{ width: `${ilerleme}%` }}
              />
            </div>

            <div className="mt-5 space-y-3">
              {IZOLASYON_ADIMLARI.map((a, i) => {
                const tamamMi = gecen >= a.t
                const aktifMi =
                  tamamMi &&
                  (i === IZOLASYON_ADIMLARI.length - 1 || gecen < IZOLASYON_ADIMLARI[i + 1].t)
                return (
                  <div key={a.t} className="flex items-start gap-3">
                    <div
                      className={
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] transition ' +
                        (tamamMi
                          ? 'border-accent-500 bg-accent-500 text-ink-950'
                          : 'border-ink-600 text-slate-600')
                      }
                    >
                      {tamamMi ? '✓' : a.t}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500">{a.t}s</span>
                        {aktifMi && durum === 'calisiyor' && (
                          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-400" />
                        )}
                      </div>
                      <div
                        className={
                          'text-sm ' + (tamamMi ? 'text-slate-200' : 'text-slate-600')
                        }
                      >
                        {a.metin}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {durum === 'tamam' && (
              <div className="mt-5 rounded-lg border border-accent-600/40 bg-accent-500/10 p-4 text-sm text-accent-400">
                <div>
                  ✓ Tehdit izole edildi. İK-PC-07 karantinada, yayılma engellendi. Immutable yedek
                  bütünlüğü doğrulandı — sistem 4 saatlik RTO içinde geri yüklenmeye hazır.
                </div>
                {someYeGit && (
                  <button
                    onClick={someYeGit}
                    className="mt-3 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20"
                  >
                    🏛️ Olayı SGB'ye bildir / SOME faaliyetine işle →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
