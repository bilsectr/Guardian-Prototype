import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { FIRMA, KATEGORILER, SEVIYELER, YEDEKLEME } from '../data/seed.js'
import {
  kategoriBazindaKapsama,
  durumSayilari,
  hazirlikDurumu,
} from '../lib/scoring.js'
import { Card, CoverageRing, Stat, DurumBadge, SeviyeBadge } from './ui.jsx'

export default function Dashboard({
  kapsamKontroller,
  genelSkor,
  hedefSeviye,
  setHedefSeviye,
  setSekme,
  politikayaGonder,
  alarmlar = [],
  vakalar = [],
}) {
  const aktifAlarm = alarmlar.filter((a) => a.durum !== 'kapatildi').length
  const kritikAlarm = alarmlar.filter((a) => a.onem === 'kritik' && a.durum !== 'kapatildi').length
  const acikVaka = vakalar.filter((v) => v.durum === 'acik').length
  const katKapsama = useMemo(
    () => kategoriBazindaKapsama(kapsamKontroller, KATEGORILER),
    [kapsamKontroller]
  )
  const sayilar = durumSayilari(kapsamKontroller)
  const hazirlik = hazirlikDurumu(genelSkor)

  const kritikEksikler = kapsamKontroller
    .filter((k) => k.durum === 'eksik')
    .slice(0, 6)

  const barRenk = (y) => (y >= 80 ? '#16c9ac' : y >= 50 ? '#f59e0b' : '#ef4444')

  return (
    <div className="space-y-6">
      <Header
        baslik="Genel Bakış"
        altBaslik={`${FIRMA.ad} · SSB Siber Hijyen-KOBİ uyum durumu`}
        hedefSeviye={hedefSeviye}
        setHedefSeviye={setHedefSeviye}
      />

      {/* Üst kartlar */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 flex items-center gap-6 p-6 lg:col-span-4">
          <CoverageRing yuzde={genelSkor} renk={barRenk(genelSkor)} />
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Genel Uyum Skoru</div>
              <div className="text-3xl font-bold">%{genelSkor}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Hedef seviye:</span>
              <SeviyeBadge seviye={hedefSeviye} />
              <span className="text-xs font-medium text-slate-300">
                {SEVIYELER[hedefSeviye].ad}
              </span>
            </div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: hazirlik.renk + '1f', color: hazirlik.renk }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hazirlik.renk }} />
              {hazirlik.ad}
            </div>
          </div>
        </Card>

        <Card className="col-span-12 grid grid-cols-3 items-center gap-4 p-6 lg:col-span-4">
          <Stat label="Uygun" value={sayilar.uygun} sub="kontrol" renk="#16c9ac" />
          <Stat label="Kısmi" value={sayilar.kismi} sub="kontrol" renk="#f59e0b" />
          <Stat label="Eksik" value={sayilar.eksik} sub="kontrol" renk="#ef4444" />
          <div className="col-span-3 mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-700">
            <div className="flex h-full">
              <div
                className="h-full bg-accent-500"
                style={{ width: `${(sayilar.uygun / kapsamKontroller.length) * 100}%` }}
              />
              <div
                className="h-full bg-amber-500"
                style={{ width: `${(sayilar.kismi / kapsamKontroller.length) * 100}%` }}
              />
              <div
                className="h-full bg-red-500"
                style={{ width: `${(sayilar.eksik / kapsamKontroller.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="col-span-3 text-[11px] text-slate-500">
            Hedef seviye kapsamında {kapsamKontroller.length} kontrol değerlendirildi.
          </div>
        </Card>

        <Card className="col-span-12 p-6 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Fidye Yazılımı Hazırlığı
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-accent-400">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" />
              İzleniyor
            </span>
          </div>
          <div className="space-y-2.5 text-sm">
            <Satir k="Immutable yedek" v={YEDEKLEME.immutableAktif ? 'Aktif' : 'Pasif'} ok={YEDEKLEME.immutableAktif} />
            <Satir k="Kapsanan sistem" v={`${YEDEKLEME.kapsananSistem}/${YEDEKLEME.toplamSistem}`} />
            <Satir k="RTO taahhüdü" v={YEDEKLEME.rtoTaahhut} />
            <Satir k="Son restore testi" v={`${YEDEKLEME.sonRestoreTesti} · ${YEDEKLEME.sonRestoreSonuc}`} ok />
          </div>
          <button
            onClick={() => setSekme('fidye')}
            className="mt-4 w-full rounded-lg border border-ink-600 py-2 text-xs font-medium text-slate-300 transition hover:border-accent-500 hover:text-accent-400"
          >
            Fidye koruması panelini aç →
          </button>
        </Card>
      </div>

      {/* SOC durum şeridi */}
      {alarmlar.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-ink-700 bg-ink-850/70 px-5 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" />
            Güvenlik Operasyonu (7/24)
          </span>
          <span className="text-sm text-slate-400">
            Aktif alarm: <span className="font-semibold text-accent-400">{aktifAlarm}</span>
          </span>
          <span className="text-sm text-slate-400">
            Kritik: <span className="font-semibold text-red-400">{kritikAlarm}</span>
          </span>
          <span className="text-sm text-slate-400">
            Açık vaka: <span className="font-semibold text-amber-400">{acikVaka}</span>
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setSekme('izleme')}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-accent-500 hover:text-accent-400"
            >
              SIEM →
            </button>
            <button
              onClick={() => setSekme('olaylar')}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-accent-500 hover:text-accent-400"
            >
              Olaylar →
            </button>
          </div>
        </div>
      )}

      {/* Grafik + kritik eksikler */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 p-6 lg:col-span-7">
          <div className="mb-4 text-sm font-semibold text-slate-200">
            Kategori Bazında Kapsama (%)
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={katKapsama} layout="vertical" margin={{ left: 8, right: 24 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#7d8bab', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="kisaAd"
                width={140}
                tick={{ fill: '#a7b3cc', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#ffffff08' }}
                contentStyle={{
                  background: '#111a2e',
                  border: '1px solid #1e2b4a',
                  borderRadius: 8,
                  color: '#e6edf7',
                  fontSize: 12,
                }}
                formatter={(v) => [`%${v}`, 'Kapsama']}
              />
              <Bar dataKey="yuzde" radius={[0, 4, 4, 0]} barSize={14}>
                {katKapsama.map((d) => (
                  <Cell key={d.id} fill={barRenk(d.yuzde)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="col-span-12 p-6 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">Kritik Eksikler</div>
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
              {kapsamKontroller.filter((k) => k.durum === 'eksik').length} açık
            </span>
          </div>
          <div className="space-y-2">
            {kritikEksikler.map((k) => (
              <div
                key={k.no}
                className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900/50 p-3"
              >
                <span className="mt-0.5 shrink-0 rounded bg-ink-700 px-1.5 py-0.5 text-[11px] font-mono text-slate-300">
                  {k.no}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-xs text-slate-300">{k.metin}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <SeviyeBadge seviye={k.seviye} />
                    <button
                      onClick={() => politikayaGonder(k)}
                      className="text-[11px] font-medium text-accent-400 hover:underline"
                    >
                      Brain ile çöz →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Satir({ k, v, ok }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{k}</span>
      <span className={ok ? 'font-medium text-accent-400' : 'font-medium text-slate-200'}>{v}</span>
    </div>
  )
}

export function Header({ baslik, altBaslik, hedefSeviye, setHedefSeviye }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{baslik}</h1>
        <p className="mt-1 text-sm text-slate-400">{altBaslik}</p>
      </div>
      {setHedefSeviye && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Hedef Seviye:</span>
          <div className="flex rounded-lg border border-ink-700 bg-ink-850 p-0.5">
            {Object.entries(SEVIYELER).map(([anahtar, s]) => {
              const aktif = hedefSeviye === anahtar
              return (
                <button
                  key={anahtar}
                  onClick={() => setHedefSeviye(anahtar)}
                  className={
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition ' +
                    (aktif ? 'bg-accent-500 text-ink-950' : 'text-slate-400 hover:text-white')
                  }
                >
                  {s.ad}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
