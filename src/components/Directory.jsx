import { useMemo, useState } from 'react'
import { KONTROLLER } from '../data/seed.js'
import {
  OU_AGACI,
  GRUPLAR,
  KULLANICILAR,
  BILGISAYARLAR,
  KULLANICI_SORUNLARI,
} from '../data/directory.js'
import { brainCall, SYSTEM_YERLESTIR } from '../lib/ai.js'
import { FALLBACK_YERLESTIR } from '../data/fallbacks.js'
import { Card, AccentButton } from './ui.jsx'
import { Header } from './Dashboard.jsx'
import { MarkdownView, KaynakRozet, LoadingLine } from './Brain.jsx'

const ALT_BOLUMLER = [
  { id: 'kullanicilar', ad: 'Kullanıcılar', ikon: '👤' },
  { id: 'bilgisayarlar', ad: 'Bilgisayarlar', ikon: '💻' },
  { id: 'gruplar', ad: 'Gruplar ve Erişim', ikon: '🔑' },
  { id: 'politikalar', ad: 'Dizin Politikaları', ikon: '⚙️' },
]

const OU_AD = Object.fromEntries(OU_AGACI.map((o) => [o.id, o.ad]))

export default function Directory({
  politikalar,
  politikaToggle,
  dizinSeti,
  hedefSeviye,
  setHedefSeviye,
  compassaGit,
}) {
  const [bolum, setBolum] = useState('politikalar')
  const [aktifOu, setAktifOu] = useState(null) // null = tüm firma

  const toplamKontrol = KONTROLLER.length
  const karsilanan = dizinSeti.size

  const ouKullanici = useMemo(
    () => (aktifOu ? KULLANICILAR.filter((u) => u.ou === aktifOu) : KULLANICILAR),
    [aktifOu]
  )
  const ouBilgisayar = useMemo(
    () => (aktifOu ? BILGISAYARLAR.filter((b) => b.ou === aktifOu) : BILGISAYARLAR),
    [aktifOu]
  )

  return (
    <div className="space-y-6">
      <Header
        baslik="BilSec Directory — Kimlik ve Erişim Yönetimi"
        altBaslik="Samba tabanlı dizin yönetimi · organizasyon, kullanıcı, cihaz ve politika kontrolü"
      />

      {/* Kilit özet: dizin → uyum döngüsü */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-sky-500/30 bg-sky-500/[0.07] px-5 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-2xl">
          🔗
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-100">
            Bu dizin yapılandırması,{' '}
            <span className="text-sky-300">{toplamKontrol} SSB kontrolünün {karsilanan}'ini</span>{' '}
            otomatik karşılıyor.
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            IT yönetimi ile uyum sağlama tek işlem: etkin dizin politikaları Compass'ta ilgili
            kontrolleri kendiliğinden "Uygun" yapar.
          </div>
        </div>
        <button
          onClick={() => setBolum('politikalar')}
          className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20"
        >
          Politikaları gör →
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* OU ağacı */}
        <Card className="col-span-12 p-4 lg:col-span-3">
          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Organizasyon Yapısı
          </div>
          <button
            onClick={() => setAktifOu(null)}
            className={
              'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ' +
              (aktifOu === null ? 'bg-accent-500/15 text-accent-400' : 'hover:bg-ink-800')
            }
          >
            🏢 <span className="font-medium">Örnek Savunma Sanayi A.Ş.</span>
          </button>
          <div className="mt-1 space-y-0.5 border-l border-ink-700 pl-3">
            {OU_AGACI.map((ou) => {
              const uc = KULLANICILAR.filter((u) => u.ou === ou.id).length
              const aktif = aktifOu === ou.id
              return (
                <button
                  key={ou.id}
                  onClick={() => setAktifOu(ou.id)}
                  className={
                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition ' +
                    (aktif ? 'bg-accent-500/15 text-accent-400' : 'text-slate-300 hover:bg-ink-800')
                  }
                >
                  <span className="text-slate-500">📁</span>
                  <span className="flex-1 truncate">{ou.ad}</span>
                  <span className="text-[10px] text-slate-500">{uc}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Sağ panel */}
        <div className="col-span-12 space-y-4 lg:col-span-9">
          <div className="flex flex-wrap gap-2">
            {ALT_BOLUMLER.map((b) => (
              <button
                key={b.id}
                onClick={() => setBolum(b.id)}
                className={
                  'flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ' +
                  (bolum === b.id
                    ? 'border-accent-500 bg-accent-500/15 text-accent-400'
                    : 'border-ink-700 text-slate-300 hover:border-ink-600 hover:text-white')
                }
              >
                <span>{b.ikon}</span>
                {b.ad}
              </button>
            ))}
          </div>

          {aktifOu && bolum !== 'politikalar' && bolum !== 'gruplar' && (
            <div className="text-xs text-slate-400">
              Filtre: <span className="text-accent-400">{OU_AD[aktifOu]}</span> ·{' '}
              <button onClick={() => setAktifOu(null)} className="underline hover:text-slate-200">
                tümünü göster
              </button>
            </div>
          )}

          {bolum === 'kullanicilar' && <Kullanicilar kullanicilar={ouKullanici} compassaGit={compassaGit} />}
          {bolum === 'bilgisayarlar' && <Bilgisayarlar bilgisayarlar={ouBilgisayar} />}
          {bolum === 'gruplar' && <Gruplar />}
          {bolum === 'politikalar' && (
            <Politikalar politikalar={politikalar} politikaToggle={politikaToggle} compassaGit={compassaGit} />
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- KULLANICILAR ----------
function Kullanicilar({ kullanicilar, compassaGit }) {
  const [yerlestirAcik, setYerlestirAcik] = useState(false)
  const sorunlu = kullanicilar.filter((u) => u.sorun).length

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">
          Kullanıcılar <span className="text-slate-500">({kullanicilar.length})</span>
          {sorunlu > 0 && (
            <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-400">
              {sorunlu} dikkat
            </span>
          )}
        </div>
        <AccentButton onClick={() => setYerlestirAcik((v) => !v)} className="!px-3 !py-2 text-xs">
          🧠 Yeni personel yerleştir
        </AccentButton>
      </div>

      {yerlestirAcik && <YeniPersonel />}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-left text-xs text-slate-400">
              <th className="py-2 pr-3">Ad-Soyad</th>
              <th className="py-2 pr-3">Kullanıcı</th>
              <th className="py-2 pr-3">Departman</th>
              <th className="py-2 pr-3">Gruplar</th>
              <th className="py-2 pr-3 text-center">MFA</th>
              <th className="py-2 pr-3 text-center">Yerel Admin</th>
              <th className="py-2 pr-3">Son Giriş</th>
              <th className="py-2">Durum</th>
            </tr>
          </thead>
          <tbody>
            {kullanicilar.map((u) => {
              const sorun = u.sorun ? KULLANICI_SORUNLARI[u.sorun] : null
              return (
                <tr
                  key={u.kullanici}
                  className={
                    'border-b border-ink-800 ' + (sorun ? 'bg-red-500/[0.04]' : '')
                  }
                >
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-100">{u.ad}</span>
                      {sorun && (
                        <button
                          onClick={() => compassaGit(sorun.ssb)}
                          title={`${sorun.etiket} — SSB ${sorun.ssb} (Compass'ta gör)`}
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: sorun.renk + '22', color: sorun.renk }}
                        >
                          ⚠ {sorun.etiket}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-slate-400">{u.kullanici}</td>
                  <td className="py-2.5 pr-3 text-slate-300">{OU_AD[u.ou]}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {u.gruplar.length === 0 && <span className="text-xs text-slate-600">—</span>}
                      {u.gruplar.map((g) => (
                        <span
                          key={g}
                          className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-slate-300"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-center">
                    <Nokta ok={u.mfa} />
                  </td>
                  <td className="py-2.5 pr-3 text-center">
                    {u.yerelAdmin ? (
                      <span className="text-xs font-medium text-amber-400">Evet</span>
                    ) : (
                      <span className="text-xs text-slate-500">Hayır</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-xs text-slate-400">{u.sonGiris}</td>
                  <td className="py-2.5">
                    <span
                      className={
                        'rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                        (u.durum === 'aktif'
                          ? 'bg-accent-500/15 text-accent-400'
                          : 'bg-slate-500/15 text-slate-400')
                      }
                    >
                      {u.durum === 'aktif' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function YeniPersonel() {
  const [ad, setAd] = useState('')
  const [dept, setDept] = useState('Mühendislik / Ar-Ge')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)

  async function oner() {
    setYukleniyor(true)
    setCikti(null)
    const prompt = `Yeni personel: ${ad || 'Yeni Personel'}\nDepartman: ${dept}\nMevcut OU'lar: Yönetim, Muhasebe-Finans, Mühendislik / Ar-Ge, Üretim, Bilgi Teknolojileri, Satış, İnsan Kaynakları.\nMevcut gruplar: GRP-Yonetim, GRP-Muhasebe, GRP-ArGe-Gizli, GRP-BT-Yonetici, GRP-Uzaktan-Erisim.\nUygun OU, gruplar ve dizin politikası setini gerekçesiyle öner.`
    const r = await brainCall({
      system: SYSTEM_YERLESTIR,
      prompt,
      max_tokens: 1000,
      fallback: FALLBACK_YERLESTIR,
    })
    setCikti(r)
    setYukleniyor(false)
  }

  return (
    <div className="mb-4 rounded-lg border border-accent-600/40 bg-accent-500/[0.06] p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label className="text-xs text-slate-400">Ad-Soyad</label>
          <input
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder="Örn. Ayşe Yıldız"
            className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-2 text-sm outline-none focus:border-accent-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-400">Departman</label>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-2 text-sm outline-none focus:border-accent-500"
          >
            {OU_AGACI.map((o) => (
              <option key={o.id}>{o.ad}</option>
            ))}
          </select>
        </div>
        <AccentButton onClick={oner} disabled={yukleniyor}>
          {yukleniyor ? 'Öneriliyor…' : 'Öner'}
        </AccentButton>
      </div>
      <div className="mt-4">
        {yukleniyor && <LoadingLine />}
        {cikti && (
          <div>
            <div className="mb-2">
              <KaynakRozet source={cikti.source} model={cikti.model} />
            </div>
            <div className="max-h-[40vh] overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/50 p-4">
              <MarkdownView text={cikti.text} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- BİLGİSAYARLAR ----------
function Bilgisayarlar({ bilgisayarlar }) {
  const uyumRenk = { uyumlu: '#16c9ac', dikkat: '#f59e0b', uyumsuz: '#ef4444' }
  const uyumAd = { uyumlu: 'Uyumlu', dikkat: 'Dikkat', uyumsuz: 'Uyumsuz' }
  return (
    <Card className="p-5">
      <div className="mb-4 text-sm font-semibold text-slate-200">
        Etki Alanına Katılı Bilgisayarlar{' '}
        <span className="text-slate-500">({bilgisayarlar.length})</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-left text-xs text-slate-400">
              <th className="py-2 pr-3">Bilgisayar</th>
              <th className="py-2 pr-3">Departman</th>
              <th className="py-2 pr-3">İşletim Sistemi</th>
              <th className="py-2 pr-3 text-center">BitLocker</th>
              <th className="py-2 pr-3 text-center">Antivirüs</th>
              <th className="py-2 pr-3">Son Güncelleme</th>
              <th className="py-2">Uyum</th>
            </tr>
          </thead>
          <tbody>
            {bilgisayarlar.map((b) => (
              <tr key={b.ad} className="border-b border-ink-800">
                <td className="py-2.5 pr-3 font-mono text-xs text-slate-100">{b.ad}</td>
                <td className="py-2.5 pr-3 text-slate-300">{OU_AD[b.ou]}</td>
                <td className="py-2.5 pr-3 text-slate-400">{b.os}</td>
                <td className="py-2.5 pr-3 text-center">
                  {b.bitlocker ? (
                    <Nokta ok />
                  ) : (
                    <span className="text-xs font-medium text-red-400">Kapalı</span>
                  )}
                </td>
                <td className="py-2.5 pr-3 text-center">
                  {b.antivirus ? (
                    <Nokta ok />
                  ) : (
                    <span className="text-xs font-medium text-red-400">Pasif</span>
                  )}
                </td>
                <td className="py-2.5 pr-3 text-xs text-slate-400">{b.sonGuncelleme}</td>
                <td className="py-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ backgroundColor: uyumRenk[b.uyum] + '1f', color: uyumRenk[b.uyum] }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: uyumRenk[b.uyum] }}
                    />
                    {uyumAd[b.uyum]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ---------- GRUPLAR ----------
function Gruplar() {
  const [aktif, setAktif] = useState(GRUPLAR[2].id)
  const uyeler = KULLANICILAR.filter((u) => u.gruplar.includes(aktif))
  const grup = GRUPLAR.find((g) => g.id === aktif)
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 p-3 lg:col-span-5">
        {GRUPLAR.map((g) => {
          const say = KULLANICILAR.filter((u) => u.gruplar.includes(g.id)).length
          const a = aktif === g.id
          return (
            <button
              key={g.id}
              onClick={() => setAktif(g.id)}
              className={
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ' +
                (a ? 'bg-accent-500/15' : 'hover:bg-ink-800')
              }
            >
              <span className="text-slate-500">🔑</span>
              <div className="min-w-0 flex-1">
                <div className={'truncate font-mono text-sm ' + (a ? 'text-accent-400' : 'text-slate-200')}>
                  {g.ad}
                </div>
                <div className="truncate text-[11px] text-slate-500">{g.aciklama}</div>
              </div>
              {g.hassas && (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-400">
                  Hassas
                </span>
              )}
              <span className="text-[11px] text-slate-500">{say}</span>
            </button>
          )
        })}
      </Card>
      <Card className="col-span-12 p-5 lg:col-span-7">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-slate-100">{grup.ad}</span>
          {grup.hassas && (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-400">
              Üyelik izleniyor
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">{grup.aciklama}</p>
        <div className="mt-4 space-y-1.5">
          {uyeler.length === 0 && <div className="text-sm text-slate-500">Üye yok.</div>}
          {uyeler.map((u) => (
            <div
              key={u.kullanici}
              className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/40 px-3 py-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-700 text-xs">
                {u.ad.charAt(0)}
              </span>
              <span className="text-sm text-slate-200">{u.ad}</span>
              <span className="font-mono text-xs text-slate-500">{u.kullanici}</span>
              <span className="ml-auto text-xs text-slate-500">{OU_AD[u.ou]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---------- POLİTİKALAR ----------
function Politikalar({ politikalar, politikaToggle, compassaGit }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {politikalar.map((p) => (
        <Card key={p.id} className="col-span-12 p-5 md:col-span-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <div className="font-semibold text-slate-100">{p.ad}</div>
            </div>
            <button
              onClick={() => politikaToggle(p.id)}
              className={
                'relative h-6 w-11 shrink-0 rounded-full transition ' +
                (p.aktif ? 'bg-accent-500' : 'bg-ink-600')
              }
              title={p.aktif ? 'Etkin — devre dışı bırak' : 'Devre dışı — etkinleştir'}
            >
              <span
                className={
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ' +
                  (p.aktif ? 'left-[22px]' : 'left-0.5')
                }
              />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{p.aciklama}</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Kapsam: {p.kapsam}</span>
            <span className={p.aktif ? 'font-medium text-accent-400' : 'text-slate-500'}>
              {p.aktif ? '● Etkin' : '○ Devre Dışı'}
            </span>
          </div>
          <div className="mt-3 border-t border-ink-700 pt-3">
            <div className="mb-1.5 text-[11px] font-medium text-slate-400">
              Karşıladığı SSB kontrolleri:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.karsilar.map((no) => (
                <button
                  key={no}
                  onClick={() => compassaGit(no)}
                  disabled={!p.aktif}
                  title={`Compass'ta ${no} kontrolüne git`}
                  className={
                    'rounded-md px-2 py-1 font-mono text-[11px] font-semibold transition ' +
                    (p.aktif
                      ? 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/30'
                      : 'bg-ink-700 text-slate-500')
                  }
                >
                  SSB {no}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ---------- yardımcı ----------
function Nokta({ ok }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: ok ? '#16c9ac' : '#ef4444' }}
      title={ok ? 'Etkin' : 'Pasif'}
    />
  )
}
