import { useMemo, useState } from 'react'
import { ONEMLER, ALARM_DURUMLARI, AJANLAR } from '../data/soc.js'
import { brainCall, SYSTEM_ATLAS } from '../lib/ai.js'
import { FALLBACK_ATLAS } from '../data/fallbacks.js'
import { Card, Pill, AccentButton } from './ui.jsx'
import { Header } from './Dashboard.jsx'
import { MarkdownView, KaynakRozet, LoadingLine } from './Brain.jsx'

export default function Siem({ alarmlar, vakaOlustur }) {
  const [onemF, setOnemF] = useState('hepsi')
  const [durumF, setDurumF] = useState('hepsi')
  const [hostF, setHostF] = useState('hepsi')
  const [secili, setSecili] = useState(alarmlar[0] || null)

  const hostlar = useMemo(() => [...new Set(alarmlar.map((a) => a.host))], [alarmlar])

  const filtreli = useMemo(
    () =>
      alarmlar.filter(
        (a) =>
          (onemF === 'hepsi' || a.onem === onemF) &&
          (durumF === 'hepsi' || a.durum === durumF) &&
          (hostF === 'hepsi' || a.host === hostF)
      ),
    [alarmlar, onemF, durumF, hostF]
  )

  const kritikSayi = alarmlar.filter((a) => a.onem === 'kritik' && a.durum !== 'kapatildi').length

  return (
    <div className="space-y-6">
      <Header
        baslik="İzleme (SIEM) — Güvenlik Operasyon Merkezi"
        altBaslik="7/24 alarm akışı · MITRE ATT&CK eşlemesi · Atlas otomatik triyajı"
      />

      {/* Özet şeritleri */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Ozet ad="Aktif Alarm" deger={alarmlar.filter((a) => a.durum !== 'kapatildi').length} renk="#38e1c8" />
        <Ozet ad="Kritik (açık)" deger={kritikSayi} renk="#ef4444" />
        <Ozet ad="İnceleniyor" deger={alarmlar.filter((a) => a.durum === 'inceleniyor').length} renk="#f59e0b" />
        <Ozet ad="İzlenen Host" deger={hostlar.length} renk="#7dd3fc" />
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-700 bg-ink-850/70 px-4 py-3">
        <FiltreGrup
          etiket="Önem"
          deger={onemF}
          setDeger={setOnemF}
          secenekler={[['hepsi', 'Tümü'], ...Object.values(ONEMLER).map((o) => [o.kod, o.ad])]}
        />
        <FiltreGrup
          etiket="Durum"
          deger={durumF}
          setDeger={setDurumF}
          secenekler={[['hepsi', 'Tümü'], ...Object.values(ALARM_DURUMLARI).map((d) => [d.kod, d.ad])]}
        />
        <FiltreGrup
          etiket="Host"
          deger={hostF}
          setDeger={setHostF}
          secenekler={[['hepsi', 'Tümü'], ...hostlar.map((h) => [h, h])]}
        />
        <span className="ml-auto text-xs text-slate-500">{filtreli.length} alarm gösteriliyor</span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Alarm tablosu */}
        <Card className="col-span-12 overflow-hidden lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700 text-left text-xs text-slate-400">
                  <th className="px-4 py-2.5">Zaman</th>
                  <th className="px-2 py-2.5">Host</th>
                  <th className="px-2 py-2.5">Alarm</th>
                  <th className="px-2 py-2.5">MITRE</th>
                  <th className="px-2 py-2.5">Önem</th>
                  <th className="px-4 py-2.5">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filtreli.map((a) => {
                  const sec = secili?.id === a.id
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSecili(a)}
                      className={
                        'cursor-pointer border-b border-ink-800 transition ' +
                        (sec ? 'bg-accent-500/10' : 'hover:bg-ink-800/60')
                      }
                    >
                      <td className="px-4 py-2.5 text-xs text-slate-400">{a.zaman}</td>
                      <td className="px-2 py-2.5 font-mono text-xs text-slate-200">{a.host}</td>
                      <td className="px-2 py-2.5 text-slate-200">
                        <div className="flex items-center gap-2">
                          {a.onem === 'kritik' && (
                            <span className="h-2 w-2 shrink-0 animate-pulse-dot rounded-full bg-red-500" />
                          )}
                          <span className="line-clamp-1">{a.baslik}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <span
                          className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                          title={a.mitre.ad}
                        >
                          {a.mitre.kod}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <Pill ad={ONEMLER[a.onem].ad} renk={ONEMLER[a.onem].renk} />
                      </td>
                      <td className="px-4 py-2.5">
                        <Pill ad={ALARM_DURUMLARI[a.durum].ad} renk={ALARM_DURUMLARI[a.durum].renk} dot={false} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Atlas triyaj paneli */}
        <div className="col-span-12 lg:col-span-4">
          {secili && <AtlasPanel alarm={secili} vakaOlustur={vakaOlustur} />}
        </div>
      </div>
    </div>
  )
}

function AtlasPanel({ alarm, vakaOlustur }) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cikti, setCikti] = useState(null)

  // Alarm değişince triyajı sıfırla
  const key = alarm.id
  const [sonKey, setSonKey] = useState(key)
  if (sonKey !== key) {
    setSonKey(key)
    setCikti(null)
    setYukleniyor(false)
  }

  async function triyajEt() {
    setYukleniyor(true)
    setCikti(null)
    const prompt = `Alarm: ${alarm.baslik}\nHost: ${alarm.host}\nKullanıcı: ${alarm.kullanici}\nÖnem: ${alarm.onem}\nMITRE: ${alarm.mitre.kod} — ${alarm.mitre.ad}\nDetay: ${alarm.aciklama}\n\nBu alarmı triyaj et.`
    const r = await brainCall({ system: SYSTEM_ATLAS, prompt, max_tokens: 900, fallback: FALLBACK_ATLAS })
    setCikti(r)
    setYukleniyor(false)
  }

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-center gap-2 border-b border-ink-700 pb-3">
        <span className="text-xl">{AJANLAR.atlas.ikon}</span>
        <div>
          <div className="text-sm font-semibold text-slate-100">Atlas — {AJANLAR.atlas.rol}</div>
          <div className="text-[11px] text-slate-500">BilSec Brain SOC ajanı</div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <Satir k="Alarm" v={alarm.baslik} />
        <Satir k="Host" v={alarm.host} mono />
        <Satir k="MITRE" v={`${alarm.mitre.kod} — ${alarm.mitre.ad}`} />
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Önem</span>
          <Pill ad={ONEMLER[alarm.onem].ad} renk={ONEMLER[alarm.onem].renk} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <AccentButton onClick={triyajEt} disabled={yukleniyor} className="flex-1 !py-2 text-xs">
          {yukleniyor ? 'Triyaj yapılıyor…' : '🛰️ Atlas ile triyaj et'}
        </AccentButton>
        <button
          onClick={() => vakaOlustur(alarm)}
          className="rounded-lg border border-ink-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-accent-500 hover:text-accent-400"
        >
          {alarm.vakaId ? 'Vakaya git →' : 'Vaka oluştur →'}
        </button>
      </div>

      <div className="mt-4 flex-1">
        {yukleniyor && <LoadingLine />}
        {!yukleniyor && !cikti && (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-center text-slate-500">
            <div className="text-3xl">🛰️</div>
            <p className="mt-2 max-w-[220px] text-xs">
              Atlas, seçili alarmı sınıflandırıp önerilen ilk aksiyonu çıkaracak.
            </p>
          </div>
        )}
        {cikti && (
          <div>
            <div className="mb-2">
              <KaynakRozet source={cikti.source} model={cikti.model} />
            </div>
            <div className="max-h-[42vh] overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/50 p-3">
              <MarkdownView text={cikti.text} />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function Ozet({ ad, deger, renk }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-slate-400">{ad}</div>
      <div className="mt-1 text-2xl font-bold" style={{ color: renk }}>
        {deger}
      </div>
    </Card>
  )
}

function FiltreGrup({ etiket, deger, setDeger, secenekler }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{etiket}:</span>
      <select
        value={deger}
        onChange={(e) => setDeger(e.target.value)}
        className="rounded-lg border border-ink-700 bg-ink-900/60 px-2.5 py-1.5 text-xs outline-none focus:border-accent-500"
      >
        {secenekler.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}

function Satir({ k, v, mono }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-slate-400">{k}</span>
      <span className={'text-right text-slate-200 ' + (mono ? 'font-mono' : '')}>{v}</span>
    </div>
  )
}
