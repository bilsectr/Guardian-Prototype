import { useEffect, useMemo, useState } from 'react'
import {
  VAKA_DURUMLARI,
  ONEMLER,
  TIMELINE_TURLERI,
  SOME_DURUM,
} from '../data/soc.js'
import {
  brainCall,
  SYSTEM_SCRIBE_OLAY,
  SYSTEM_SCRIBE_SOME,
} from '../lib/ai.js'
import { FALLBACK_SCRIBE_OLAY, FALLBACK_SCRIBE_SOME } from '../data/fallbacks.js'
import { Card, Pill, AccentButton } from './ui.jsx'
import { Header } from './Dashboard.jsx'
import { MarkdownView, KaynakRozet, LoadingLine } from './Brain.jsx'

const ALT = [
  { id: 'vakalar', ad: 'Vaka Yönetimi', ikon: '🗂️' },
  { id: 'some', ad: 'Yönetilen SOME', ikon: '🏛️' },
]

export default function Incidents({
  vakalar,
  alarmlar,
  odakVaka,
  setOdakVaka,
  altSekme,
  setAltSekme,
  vakaTimelineEkle,
  sgbBildirimler,
  sgbBildir,
  fidyeyeGit,
  compassaGit,
}) {
  return (
    <div className="space-y-6">
      <Header
        baslik="Siber Olay Yönetimi & Yönetilen SOME"
        altBaslik="Vaka takibi · zaman çizelgeli olay geçmişi · SGB bildirim ve SOME faaliyeti"
      />

      <div className="flex gap-2">
        {ALT.map((a) => (
          <button
            key={a.id}
            onClick={() => setAltSekme(a.id)}
            className={
              'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ' +
              (altSekme === a.id
                ? 'border-accent-500 bg-accent-500/15 text-accent-400'
                : 'border-ink-700 text-slate-300 hover:border-ink-600 hover:text-white')
            }
          >
            <span>{a.ikon}</span>
            {a.ad}
          </button>
        ))}
      </div>

      {altSekme === 'vakalar' && (
        <Vakalar
          vakalar={vakalar}
          odakVaka={odakVaka}
          setOdakVaka={setOdakVaka}
          vakaTimelineEkle={vakaTimelineEkle}
          fidyeyeGit={fidyeyeGit}
          compassaGit={compassaGit}
          someYeGit={() => setAltSekme('some')}
        />
      )}
      {altSekme === 'some' && (
        <Some
          vakalar={vakalar}
          alarmlar={alarmlar}
          sgbBildirimler={sgbBildirimler}
          sgbBildir={sgbBildir}
        />
      )}
    </div>
  )
}

// ================= VAKALAR =================
function Vakalar({ vakalar, odakVaka, setOdakVaka, vakaTimelineEkle, fidyeyeGit, compassaGit, someYeGit }) {
  const acik = vakalar.filter((v) => v.durum === 'acik')
  const gecmis = vakalar.filter((v) => v.durum === 'kapali')
  const [seciliNo, setSeciliNo] = useState(odakVaka || acik[0]?.no || vakalar[0]?.no)

  useEffect(() => {
    if (odakVaka) {
      setSeciliNo(odakVaka)
      const t = setTimeout(() => setOdakVaka && setOdakVaka(null), 2500)
      return () => clearTimeout(t)
    }
  }, [odakVaka])

  const secili = vakalar.find((v) => v.no === seciliNo) || vakalar[0]

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Liste */}
      <div className="col-span-12 space-y-4 lg:col-span-5">
        <VakaListe baslik="Açık Vakalar" vakalar={acik} seciliNo={seciliNo} setSeciliNo={setSeciliNo} odak={odakVaka} />
        <VakaListe baslik="Geçmiş (Kapatılmış) Vakalar" vakalar={gecmis} seciliNo={seciliNo} setSeciliNo={setSeciliNo} odak={odakVaka} />
      </div>

      {/* Detay */}
      <div className="col-span-12 lg:col-span-7">
        {secili && (
          <VakaDetay
            vaka={secili}
            vakaTimelineEkle={vakaTimelineEkle}
            fidyeyeGit={fidyeyeGit}
            compassaGit={compassaGit}
            someYeGit={someYeGit}
          />
        )}
      </div>
    </div>
  )
}

function VakaListe({ baslik, vakalar, seciliNo, setSeciliNo, odak }) {
  return (
    <Card className="p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {baslik} <span className="text-slate-600">({vakalar.length})</span>
      </div>
      <div className="space-y-2">
        {vakalar.length === 0 && <div className="px-1 py-2 text-sm text-slate-500">Kayıt yok.</div>}
        {vakalar.map((v) => {
          const sec = seciliNo === v.no
          const odakli = odak === v.no
          return (
            <button
              key={v.no}
              onClick={() => setSeciliNo(v.no)}
              className={
                'w-full rounded-lg border p-3 text-left transition ' +
                (sec
                  ? 'border-accent-500 bg-accent-500/10'
                  : odakli
                  ? 'border-sky-400'
                  : 'border-ink-700 hover:border-ink-600')
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-400">{v.no}</span>
                <Pill ad={ONEMLER[v.onem].ad} renk={ONEMLER[v.onem].renk} />
              </div>
              <div className="mt-1 text-sm text-slate-200">{v.baslik}</div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-mono">{v.host}</span>
                <span>·</span>
                <span>{v.analist}</span>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function VakaDetay({ vaka, vakaTimelineEkle, fidyeyeGit, compassaGit, someYeGit }) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)
  const [sonNo, setSonNo] = useState(vaka.no)
  if (sonNo !== vaka.no) {
    setSonNo(vaka.no)
    setCikti(null)
    setYukleniyor(false)
  }

  async function scribeRapor() {
    setYukleniyor(true)
    setCikti(null)
    const tl = vaka.timeline.map((s) => `- ${s.t} [${TIMELINE_TURLERI[s.tur].ad}] ${s.metin}`).join('\n')
    const prompt = `Vaka No: ${vaka.no}\nBaşlık: ${vaka.baslik}\nÖnem: ${vaka.onem}\nHost: ${vaka.host} · Kullanıcı: ${vaka.kullanici}\nDurum: ${vaka.durum}\nÖzet: ${vaka.ozet}\n\nOlay zaman çizelgesi:\n${tl}\n\nBu vaka için olay müdahale raporu yaz.`
    const r = await brainCall({
      system: SYSTEM_SCRIBE_OLAY,
      prompt,
      max_tokens: 1300,
      fallback: FALLBACK_SCRIBE_OLAY,
    })
    setCikti(r)
    setYukleniyor(false)
    // Zaman çizelgesine "rapor üretildi" adımı ekle (bir kez)
    if (!vaka.timeline.some((s) => s.tur === 'rapor')) {
      vakaTimelineEkle(vaka.no, {
        t: new Date().toLocaleString('tr-TR'),
        tur: 'rapor',
        metin: 'Scribe olay müdahale raporu üretti.',
      })
    }
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">{vaka.no}</span>
            <Pill ad={ONEMLER[vaka.onem].ad} renk={ONEMLER[vaka.onem].renk} />
            <Pill ad={VAKA_DURUMLARI[vaka.durum].ad} renk={VAKA_DURUMLARI[vaka.durum].renk} dot={false} />
          </div>
          <h2 className="mt-1.5 text-base font-semibold text-slate-100">{vaka.baslik}</h2>
          <div className="mt-1 text-xs text-slate-400">
            Host <span className="font-mono text-slate-300">{vaka.host}</span> · Kullanıcı{' '}
            <span className="text-slate-300">{vaka.kullanici}</span> · Analist {vaka.analist}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            Açılış: {vaka.acilis}
            {vaka.kapanis && ` · Kapanış: ${vaka.kapanis}`}
          </div>
        </div>
      </div>

      {/* Aksiyonlar (uçtan uca zincir) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {vaka.durum === 'acik' && (
          <button
            onClick={fidyeyeGit}
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
          >
            🔨 Hammer / Otomatik izolasyon →
          </button>
        )}
        <AccentButton onClick={scribeRapor} disabled={yukleniyor} className="!px-3 !py-2 text-xs">
          {yukleniyor ? 'Rapor yazılıyor…' : '✍️ Scribe ile olay raporu üret'}
        </AccentButton>
        <button
          onClick={someYeGit}
          className="rounded-lg border border-ink-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-accent-500 hover:text-accent-400"
        >
          🏛️ SGB bildirimi / SOME →
        </button>
        {vaka.durum === 'kapali' && vaka.ssb && (
          <button
            onClick={() => compassaGit(vaka.ssb)}
            className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20"
          >
            🧭 Compass SSB {vaka.ssb} →
          </button>
        )}
      </div>

      {/* Zaman çizelgesi */}
      <div className="mt-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Olay Zaman Çizelgesi
        </div>
        <div className="relative space-y-4 pl-1">
          {vaka.timeline.map((s, i) => {
            const t = TIMELINE_TURLERI[s.tur]
            const son = i === vaka.timeline.length - 1
            return (
              <div key={i} className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs"
                    style={{ backgroundColor: t.renk + '22', border: `1px solid ${t.renk}66` }}
                  >
                    {t.ikon}
                  </span>
                  {!son && <span className="mt-1 w-px flex-1 bg-ink-700" />}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold" style={{ color: t.renk }}>
                      {t.ad}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{s.t}</span>
                  </div>
                  <div className="mt-0.5 text-sm text-slate-300">{s.metin}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scribe çıktısı */}
      {(yukleniyor || cikti) && (
        <div className="mt-5 border-t border-ink-700 pt-4">
          {yukleniyor && <LoadingLine />}
          {cikti && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">✍️ Scribe Olay Raporu</span>
                <KaynakRozet source={cikti.source} model={cikti.model} />
              </div>
              <div className="max-h-[46vh] overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/50 p-4">
                <MarkdownView text={cikti.text} />
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ================= SOME =================
function Some({ vakalar, alarmlar, sgbBildirimler, sgbBildir }) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)

  const bekleyen = sgbBildirimler.filter((b) => b.durum === 'bekliyor')
  const bildirilen = sgbBildirimler.filter((b) => b.durum === 'bildirildi')
  const sonBildirim = bildirilen.map((b) => b.tarih).sort().pop() || '—'

  async function faaliyetRaporu() {
    setYukleniyor(true)
    setCikti(null)
    const onemDagilim = alarmlar.reduce((acc, a) => {
      acc[a.onem] = (acc[a.onem] || 0) + 1
      return acc
    }, {})
    const prompt = `Dönem: Temmuz 2026\nToplam alarm: ${alarmlar.length} (${JSON.stringify(onemDagilim)})\nToplam vaka: ${vakalar.length} (açık: ${vakalar.filter((v) => v.durum === 'acik').length}, kapalı: ${vakalar.filter((v) => v.durum === 'kapali').length})\nSGB'ye bildirilen: ${bildirilen.length}, bekleyen: ${bekleyen.length}\nÖnemli vakalar: ${vakalar.map((v) => `${v.no} ${v.baslik} (${v.onem})`).join('; ')}\n\nDönemsel SOME faaliyet raporu yaz.`
    const r = await brainCall({
      system: SYSTEM_SCRIBE_SOME,
      prompt,
      max_tokens: 1300,
      fallback: FALLBACK_SCRIBE_SOME,
    })
    setCikti(r)
    setYukleniyor(false)
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* SOME durum + görevler ayrılığı */}
      <div className="col-span-12 space-y-4 lg:col-span-5">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">Kurumsal SOME Durumu</div>
            <Pill ad={SOME_DURUM.kayit} renk="#16c9ac" />
          </div>
          <div className="space-y-2 text-sm">
            <Satir k="Operatör" v={SOME_DURUM.operator} />
            <Satir k="Kayıt tarihi" v={SOME_DURUM.kayitTarihi} />
            <Satir k="İletişim" v={SOME_DURUM.iletisim} />
            <Satir k="Telefon" v={SOME_DURUM.telefon} />
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Olgunluk Seviyesi</span>
              <span className="font-semibold text-accent-400">
                Seviye {SOME_DURUM.olgunluk}/{SOME_DURUM.olgunlukMax}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: SOME_DURUM.olgunlukMax }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-full"
                  style={{ backgroundColor: i < SOME_DURUM.olgunluk ? '#16c9ac' : '#1e2b4a' }}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-sky-500/25 bg-sky-500/[0.05] p-4">
          <div className="flex gap-3">
            <span className="text-lg">⚖️</span>
            <div>
              <div className="text-xs font-semibold text-sky-200">Görevler Ayrılığı</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {SOME_DURUM.gorevlerAyriligi}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* SGB bildirim + faaliyet raporu */}
      <div className="col-span-12 space-y-4 lg:col-span-7">
        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">SGB Olay Bildirimleri</div>
            <div className="text-xs text-slate-500">
              {bildirilen.length} bildirildi · son: {sonBildirim}
            </div>
          </div>
          <p className="mb-3 text-xs text-slate-500">
            Bildirilmesi gereken olaylar (simülasyon — gerçek SGB/USOM API bağlantısı yoktur).
          </p>
          <div className="space-y-2">
            {sgbBildirimler.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/40 p-3"
              >
                <span className="font-mono text-[11px] text-slate-500">{b.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-slate-200">{b.olay}</div>
                  <div className="font-mono text-[11px] text-slate-500">
                    {b.vaka} · {b.tarih}
                  </div>
                </div>
                {b.durum === 'bildirildi' ? (
                  <Pill ad="Bildirildi" renk="#16c9ac" />
                ) : (
                  <button
                    onClick={() => sgbBildir(b.id)}
                    className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-ink-950 transition hover:bg-accent-400"
                  >
                    SGB'ye bildir
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">
              ✍️ SOME Faaliyet Raporu (Scribe)
            </div>
            <AccentButton onClick={faaliyetRaporu} disabled={yukleniyor} className="!px-3 !py-2 text-xs">
              {yukleniyor ? 'Üretiliyor…' : 'Dönemsel rapor üret'}
            </AccentButton>
          </div>
          {yukleniyor && <LoadingLine />}
          {!yukleniyor && !cikti && (
            <p className="text-xs text-slate-500">
              Seçili dönemdeki alarm/vaka istatistiklerini özetleyen Türkçe faaliyet raporu üretilir.
            </p>
          )}
          {cikti && (
            <div>
              <div className="mb-2">
                <KaynakRozet source={cikti.source} model={cikti.model} />
              </div>
              <div className="max-h-[46vh] overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/50 p-4">
                <MarkdownView text={cikti.text} />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function Satir({ k, v }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-slate-400">{k}</span>
      <span className="text-right text-slate-200">{v}</span>
    </div>
  )
}
