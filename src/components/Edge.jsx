import {
  SERVISLER,
  SERVIS_DURUMLARI,
  DHCP,
  DNS,
  PAYLASIMLAR,
  VPN,
  SERTIFIKALAR,
  FIREWALL,
  ANTIVIRUS,
  GUNCELLEME,
} from '../data/edge.js'
import { YEDEKLEME } from '../data/seed.js'
import { Card, Pill } from './ui.jsx'
import { Header } from './Dashboard.jsx'

function SsbRozetleri({ nolar, compassaGit }) {
  if (!nolar || nolar.length === 0) return null
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ink-700 pt-3">
      <span className="text-[11px] text-slate-500">Karşıladığı SSB:</span>
      {nolar.map((no) => (
        <button
          key={no}
          onClick={() => compassaGit(no)}
          title={`Compass'ta ${no} kontrolüne git`}
          className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
        >
          SSB {no}
        </button>
      ))}
    </div>
  )
}

export default function Edge({ compassaGit }) {
  const saglikli = SERVISLER.filter((s) => s.durum === 'calisiyor').length
  const uyari = SERVISLER.filter((s) => s.durum === 'uyari').length
  const durdu = SERVISLER.filter((s) => s.durum === 'durdu').length
  const yedekServis = SERVISLER.find((s) => s.id === 'yedek')

  return (
    <div className="space-y-6">
      <Header
        baslik="Yerinde Altyapı — BilSec Edge"
        altBaslik="Ubuntu tabanlı yerinde sunucu · dizin, ağ, sertifika, yedek ve servis sağlığı tek ekranda"
      />

      {/* Servis sağlığı özet şeridi */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">Servis Sağlığı</div>
          <div className="flex items-center gap-2 text-xs">
            <Pill ad={`${saglikli} çalışıyor`} renk="#16c9ac" />
            {uyari > 0 && <Pill ad={`${uyari} uyarı`} renk="#f59e0b" />}
            {durdu > 0 && <Pill ad={`${durdu} durdu`} renk="#ef4444" />}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SERVISLER.map((s) => {
            const d = SERVIS_DURUMLARI[s.durum]
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/40 px-3 py-2"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.renk }} />
                <span className="truncate text-xs text-slate-200" title={s.ozet}>
                  {s.ad}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Yedekler (en görünür) */}
      <Card className="border-accent-600/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <div className="text-sm font-semibold text-slate-100">Yedekleme</div>
              <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
                <Bilgi k="Son yedek" v={`${YEDEKLEME.sonYedek}`} ok />
                <Bilgi k="Sonuç" v={`✓ ${YEDEKLEME.sonRestoreSonuc}`} ok />
                <Bilgi k="Son restore testi" v={`${YEDEKLEME.sonRestoreTesti} (3 gün önce)`} ok />
                <Bilgi k="Kapsam" v={`${YEDEKLEME.kapsananSistem}/${YEDEKLEME.toplamSistem} sistem`} />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {YEDEKLEME.saklamaKonumu} · RTO {YEDEKLEME.rtoTaahhut} · RPO {YEDEKLEME.rpo}
              </div>
            </div>
          </div>
          <Pill ad="Değiştirilemez yedek aktif" renk="#16c9ac" />
        </div>
        <SsbRozetleri nolar={yedekServis?.karsilar} compassaGit={compassaGit} />
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* DHCP */}
        <Card className="col-span-12 p-5 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">DHCP — IP Kiralamaları</div>
            <span className="font-mono text-xs text-slate-400">{DHCP.ag}</span>
          </div>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>Havuz kullanımı ({DHCP.havuz})</span>
              <span className="font-semibold text-slate-200">%{DHCP.kullanim} dolu</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-700">
              <div className="h-full rounded-full bg-accent-500" style={{ width: `${DHCP.kullanim}%` }} />
            </div>
          </div>
          <div className="max-h-[42vh] overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700 text-left text-xs text-slate-400">
                  <th className="py-2 pr-3">Bilgisayar</th>
                  <th className="py-2 pr-3">IP</th>
                  <th className="py-2 pr-3">MAC</th>
                  <th className="py-2">Kalan Süre</th>
                </tr>
              </thead>
              <tbody>
                {DHCP.leases.map((l) => (
                  <tr key={l.ip} className="border-b border-ink-800">
                    <td className="py-2 pr-3 font-mono text-xs text-slate-200">{l.host}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-slate-300">{l.ip}</td>
                    <td className="py-2 pr-3 font-mono text-[11px] text-slate-500">{l.mac}</td>
                    <td className="py-2 text-xs text-slate-400">{l.kalanSure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* DNS + NTP + Firewall + Antivirüs + Güncelleme özetleri */}
        <div className="col-span-12 space-y-6 lg:col-span-5">
          <Card className="p-5">
            <div className="mb-2 text-sm font-semibold text-slate-200">Ağ Servisleri</div>
            <div className="space-y-2 text-sm">
              <Bilgi k="DNS" v={`${DNS.gunlukSorgu.toLocaleString('tr-TR')} sorgu/gün`} ok />
              <Bilgi k="DNS forwarder" v={DNS.forwarders.join(', ')} />
              <Bilgi k="NTP zaman senkron" v="Senkron · sapma < 5 ms" ok />
              <Bilgi k="Güvenlik duvarı / IDS" v={`Bugün ${FIREWALL.bugunEngellenen.toLocaleString('tr-TR')} engellendi`} ok />
            </div>
            <SsbRozetleri
              nolar={SERVISLER.find((s) => s.id === 'radius')?.karsilar}
              compassaGit={compassaGit}
            />
          </Card>

          <Card className="p-5">
            <div className="mb-2 text-sm font-semibold text-slate-200">Antivirüs & Güncellemeler</div>
            <div className="space-y-2 text-sm">
              <Bilgi k="Antivirüs kapsamı" v={`%${ANTIVIRUS.kapsam} (${ANTIVIRUS.kapsananUcNokta}/${ANTIVIRUS.toplamUcNokta})`} ok />
              <Bilgi k="İmza güncelliği" v={ANTIVIRUS.imzaGuncel ? 'Güncel' : 'Eski'} ok={ANTIVIRUS.imzaGuncel} />
              <Bilgi k="Bekleyen yama" v={`${GUNCELLEME.bekleyen} adet`} />
              <Bilgi k="Otomatik güncelleme" v={GUNCELLEME.otomatik ? 'Açık' : 'Kapalı'} ok={GUNCELLEME.otomatik} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ink-700 pt-3">
              <span className="text-[11px] text-slate-500">Karşıladığı SSB:</span>
              {['3.4', '9.1', '9.2'].map((no) => (
                <button
                  key={no}
                  onClick={() => compassaGit(no)}
                  className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                >
                  SSB {no}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Dosya paylaşımları */}
        <Card className="col-span-12 p-5 lg:col-span-4">
          <div className="mb-3 text-sm font-semibold text-slate-200">Dosya Paylaşımları</div>
          <div className="space-y-2">
            {PAYLASIMLAR.map((p) => (
              <div key={p.yol} className="rounded-lg border border-ink-700 bg-ink-900/40 p-3">
                <div className="font-mono text-xs text-slate-200">{p.yol}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{p.grup}</span>
                  <span>{p.boyut}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* VPN */}
        <Card className="col-span-12 p-5 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">VPN — Aktif Bağlantılar</div>
            <Pill ad={`${VPN.aktif.length} aktif`} renk="#16c9ac" />
          </div>
          <div className="space-y-2">
            {VPN.aktif.map((v) => (
              <div
                key={v.kullanici}
                className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900/40 p-3 text-sm"
              >
                <span className="font-mono text-slate-200">{v.kullanici}</span>
                <span className="font-mono text-xs text-slate-400">{v.ip}</span>
                <span className="text-xs text-slate-500">{v.sure}</span>
              </div>
            ))}
          </div>
          <SsbRozetleri nolar={SERVISLER.find((s) => s.id === 'vpn')?.karsilar} compassaGit={compassaGit} />
        </Card>

        {/* Sertifikalar */}
        <Card className="col-span-12 p-5 lg:col-span-4">
          <div className="mb-3 text-sm font-semibold text-slate-200">Sertifikalar (CA)</div>
          <div className="space-y-2">
            {SERTIFIKALAR.map((c) => {
              const uyariMi = c.durum === 'uyari'
              return (
                <div
                  key={c.ad}
                  className={
                    'rounded-lg border p-3 ' +
                    (uyariMi ? 'border-amber-500/40 bg-amber-500/[0.06]' : 'border-ink-700 bg-ink-900/40')
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs text-slate-200">{c.ad}</span>
                    <span className="shrink-0 rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {c.tur}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Bitiş: {c.bitis}</span>
                    <span className={uyariMi ? 'font-semibold text-amber-400' : 'text-slate-400'}>
                      {uyariMi ? `⚠ ${c.kalanGun} gün kaldı` : `${c.kalanGun} gün`}
                    </span>
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

function Bilgi({ k, v, ok }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-400">{k}</span>
      <span className={ok ? 'font-medium text-accent-400' : 'font-medium text-slate-200'}>{v}</span>
    </div>
  )
}
