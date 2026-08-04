import { useMemo } from 'react'
import {
  MUSTERILER,
  HIZMET_PAKETLERI,
  EDGE_DURUMLARI,
  SOC_EKIBI,
  BULUT_ALARM_AKISI,
  SGB_KUYRUK,
} from '../data/cloud.js'
import { ONEMLER } from '../data/soc.js'
import { Card, Pill } from './ui.jsx'

// BilSec Cloud SOC — Yönetilen CSIRT-as-a-Service operatör görünümü.
// Müşteri lokasyonlarındaki Edge cihazlarını merkezi olarak izleyen bulut katmanı.
export default function CloudSoc({ musteriler = MUSTERILER, onMusteriAc }) {
  const m = useMemo(() => {
    const cevrimici = musteriler.filter((x) => x.edge.durum === 'cevrimici').length
    const kritikAcik = musteriler.reduce((t, x) => t + x.kritikAlarm, 0)
    const acikVaka = musteriler.reduce((t, x) => t + x.acikVaka, 0)
    const ortSkor = Math.round(
      musteriler.reduce((t, x) => t + x.uyumSkor, 0) / (musteriler.length || 1)
    )
    return { cevrimici, kritikAcik, acikVaka, ortSkor }
  }, [musteriler])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Başlık */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">BilSec Bulut SOC</h1>
          <p className="mt-1 text-sm text-slate-400">
            Yönetilen CSIRT (Managed CSIRT-as-a-Service) · müşteri lokasyonlarındaki Edge
            cihazlarını 7/24 izleyen merkezi operasyon
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1.5 text-xs font-medium text-accent-400">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" />
          Nöbet açık · 7/24
        </span>
      </div>

      {/* Mimari şerit: N Edge → 1 Bulut SOC */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-center gap-4 text-center sm:gap-8">
          <div className="flex flex-col items-center">
            <div className="text-3xl">🏭</div>
            <div className="mt-1 text-lg font-bold text-white">{musteriler.length} müşteri lokasyonu</div>
            <div className="text-xs text-slate-400">her birinde bir BilSec Edge cihazı</div>
          </div>
          <div className="flex flex-col items-center text-slate-500">
            <div className="text-2xl">⟶</div>
            <div className="text-[10px] uppercase tracking-widest">şifreli telemetri</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl">☁️</div>
            <div className="mt-1 text-lg font-bold text-accent-400">1 BilSec Bulut SOC</div>
            <div className="text-xs text-slate-400">tek ekip, tüm portföyü yönetir</div>
          </div>
          <div className="flex flex-col items-center text-slate-500">
            <div className="text-2xl">⟶</div>
            <div className="text-[10px] uppercase tracking-widest">otomatik müdahale</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl">🛡️</div>
            <div className="mt-1 text-lg font-bold text-white">Görevler ayrılığı</div>
            <div className="text-xs text-slate-400">bağımsız operatör — müşterinin BT'si değil</div>
          </div>
        </div>
      </Card>

      {/* Metrik satırı */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetrikKart etiket="Yönetilen müşteri" deger={musteriler.length} alt="aktif abonelik" renk="#38e1c8" />
        <MetrikKart
          etiket="Çevrimiçi Edge"
          deger={`${m.cevrimici}/${musteriler.length}`}
          alt="cihaz heartbeat"
          renk={m.cevrimici === musteriler.length ? '#16c9ac' : '#f59e0b'}
        />
        <MetrikKart
          etiket="Açık kritik olay"
          deger={m.kritikAcik}
          alt={`${m.acikVaka} açık vaka`}
          renk={m.kritikAcik > 0 ? '#ef4444' : '#16c9ac'}
        />
        <MetrikKart etiket="Ort. uyum skoru" deger={`%${m.ortSkor}`} alt="portföy geneli" renk="#a78bfa" />
      </div>

      {/* Müşteri portföyü */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
          <div className="text-sm font-semibold text-white">Müşteri Portföyü</div>
          <div className="text-xs text-slate-500">Aktif müşteriye tıklayın → tek-kiracılı ekranlar</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-2.5 font-medium">Müşteri</th>
                <th className="px-3 py-2.5 font-medium">Edge cihaz</th>
                <th className="px-3 py-2.5 font-medium">Paket</th>
                <th className="px-3 py-2.5 font-medium">Uyum</th>
                <th className="px-3 py-2.5 font-medium">Açık alarm</th>
                <th className="px-3 py-2.5 font-medium">Vaka</th>
              </tr>
            </thead>
            <tbody>
              {musteriler.map((c) => {
                const ed = EDGE_DURUMLARI[c.edge.durum]
                const pk = HIZMET_PAKETLERI[c.paket]
                const tiklanir = c.aktif && onMusteriAc
                return (
                  <tr
                    key={c.id}
                    onClick={tiklanir ? () => onMusteriAc(c) : undefined}
                    className={
                      'border-b border-ink-800 transition ' +
                      (tiklanir ? 'cursor-pointer hover:bg-ink-800/60' : '')
                    }
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 font-medium text-white">
                        {c.ad}
                        {c.aktif && (
                          <span className="rounded bg-accent-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent-400">
                            Bu demo
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {c.sektor} · {c.konum} · {c.personel} personel
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ed.renk }} />
                        <span style={{ color: ed.renk }}>{ed.ad}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.edge.seri} · {c.edge.sonSenkron}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Pill ad={pk.ad} renk={pk.renk} />
                      <div className="mt-0.5 text-[10px] text-slate-500">triyaj SLA {pk.triyajSla} dk</div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="font-semibold"
                        style={{ color: c.uyumSkor >= 80 ? '#16c9ac' : c.uyumSkor >= 65 ? '#f59e0b' : '#ef4444' }}
                      >
                        %{c.uyumSkor}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={c.acikAlarm > 0 ? 'text-slate-200' : 'text-slate-500'}>
                        {c.acikAlarm}
                      </span>
                      {c.kritikAlarm > 0 && (
                        <span className="ml-1.5 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                          {c.kritikAlarm} kritik
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-300">{c.acikVaka}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Alt: canlı alarm akışı + nöbet ekibi / SGB kuyruğu */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Çok-müşterili alarm akışı */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
            <div className="text-sm font-semibold text-white">Çok-Müşterili Canlı Alarm Akışı</div>
            <span className="text-xs text-slate-500">tüm portföy · Atlas ön-triyajlı</span>
          </div>
          <ul className="divide-y divide-ink-800">
            {BULUT_ALARM_AKISI.map((a, i) => {
              const o = ONEMLER[a.onem]
              return (
                <li key={i} className="flex items-start gap-3 px-5 py-3">
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: o.renk }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-100">{a.baslik}</span>
                      <Pill ad={o.ad} renk={o.renk} />
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {a.musteri} · {a.host} · {a.zaman}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <SlaRozet durum={a.durum} kalan={a.slaKalan} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Nöbet ekibi + SGB kuyruğu */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="text-sm font-semibold text-white">SOC Nöbet Ekibi</div>
            <div className="mt-3 space-y-2.5">
              {SOC_EKIBI.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-100">{p.ad}</div>
                    <div className="text-[11px] text-slate-500">{p.rol}</div>
                  </div>
                  <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[11px] text-slate-400">
                    {p.aktifVaka} vaka
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-white">SGB / USOM Bildirim Kuyruğu</div>
            <div className="mt-3 space-y-2">
              {SGB_KUYRUK.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-ink-700 bg-ink-900/40 px-3 py-2"
                >
                  <div className="text-xs text-slate-200">{s.olay}</div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{s.musteri}</span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: s.durum === 'bekliyor' ? '#f59e0b' : '#38bdf8' }}
                    >
                      {s.durum === 'bekliyor' ? 'onay bekliyor' : 'hazırlanıyor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetrikKart({ etiket, deger, alt, renk }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{etiket}</div>
      <div className="mt-1 text-2xl font-bold" style={{ color: renk }}>
        {deger}
      </div>
      <div className="text-[11px] text-slate-500">{alt}</div>
    </Card>
  )
}

function SlaRozet({ durum, kalan }) {
  if (durum === 'vaka') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
        ✓ vaka açıldı
      </span>
    )
  }
  const acil = durum === 'triyaj'
  return (
    <div className="text-[11px]">
      <span style={{ color: acil ? '#f59e0b' : '#7d8bab' }}>
        {durum === 'triyaj' ? 'triyajda' : 'kuyrukta'}
      </span>
      <div className="text-[10px] text-slate-500">SLA {kalan}</div>
    </div>
  )
}
