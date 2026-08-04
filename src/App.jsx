import { useEffect, useMemo, useState } from 'react'
import { KONTROLLER, FIRMA } from './data/seed.js'
import { DIZIN_POLITIKALARI } from './data/directory.js'
import { ALARMLAR, VAKALAR, SGB_BILDIRIMLER } from './data/soc.js'
import { SERVISLER as EDGE_SERVISLER, SERTIFIKALAR as EDGE_SERTIFIKALAR } from './data/edge.js'
import {
  kapsamdakiKontroller,
  kapsamaYuzdesi,
  dizinKapsamSeti,
  otomatikKaynaklar,
  etkinKontroller,
} from './lib/scoring.js'
import Yonetici from './components/Yonetici.jsx'
import Tour, { TUR_ADIMLAR } from './components/Tour.jsx'
import Dashboard from './components/Dashboard.jsx'
import Compliance from './components/Compliance.jsx'
import Directory from './components/Directory.jsx'
import Edge from './components/Edge.jsx'
import Siem from './components/Siem.jsx'
import Incidents from './components/Incidents.jsx'
import Brain from './components/Brain.jsx'
import Ransomware from './components/Ransomware.jsx'
import Report from './components/Report.jsx'

const TUR_ANAHTAR = 'bilsec_tur_v1'

const SEKMELER = [
  { id: 'dashboard', ad: 'Genel Bakış', ikon: '📊' },
  { id: 'uyum', ad: 'Compass Uyum', ikon: '🧭' },
  { id: 'kimlik', ad: 'Kimlik Yönetimi', ikon: '🗄️' },
  { id: 'altyapi', ad: 'Yerinde Altyapı', ikon: '🖥️' },
  { id: 'izleme', ad: 'İzleme (SIEM)', ikon: '📡' },
  { id: 'olaylar', ad: 'Olaylar & SOME', ikon: '🗂️' },
  { id: 'brain', ad: 'BilSec Brain', ikon: '🧠', vurgu: true },
  { id: 'fidye', ad: 'Fidye Koruması', ikon: '🛡️' },
  { id: 'rapor', ad: 'Rapor', ikon: '📄' },
]

export default function App() {
  const [gorunum, setGorunum] = useState('yonetici') // yonetici | uzman
  const [turAktif, setTurAktif] = useState(false)
  const [turAdim, setTurAdim] = useState(0)
  const [sekme, setSekme] = useState('dashboard')
  const [kontroller, setKontroller] = useState(KONTROLLER)
  const [hedefSeviye, setHedefSeviye] = useState(FIRMA.hedefSeviye)
  const [politikalar, setPolitikalar] = useState(DIZIN_POLITIKALARI)
  const [alarmlar, setAlarmlar] = useState(ALARMLAR)
  const [vakalar, setVakalar] = useState(VAKALAR)
  const [sgbBildirimler, setSgbBildirimler] = useState(SGB_BILDIRIMLER)

  // Odak/geçiş durumları
  const [secilenKontrol, setSecilenKontrol] = useState(null) // Compass/Directory → Brain
  const [odakKontrol, setOdakKontrol] = useState(null) // → Compass
  const [odakVaka, setOdakVaka] = useState(null) // → Olaylar
  const [olayAltSekme, setOlayAltSekme] = useState('vakalar') // vakalar | some

  // Otomatik kaynaklar: dizin politikaları + kapatılmış vakalar (Olay İhlal Yönetimi)
  const dizinSeti = useMemo(() => dizinKapsamSeti(politikalar), [politikalar])
  const kaynakMap = useMemo(
    () => otomatikKaynaklar(politikalar, vakalar, EDGE_SERVISLER),
    [politikalar, vakalar]
  )
  const etkinListe = useMemo(() => etkinKontroller(kontroller, kaynakMap), [kontroller, kaynakMap])

  const kapsamKontroller = useMemo(
    () => kapsamdakiKontroller(etkinListe, hedefSeviye),
    [etkinListe, hedefSeviye]
  )
  const genelSkor = useMemo(() => kapsamaYuzdesi(kapsamKontroller), [kapsamKontroller])

  function durumDegistir(no, yeniDurum) {
    if (kaynakMap.has(no)) return // otomatik yönetilen kontrol elle değiştirilemez
    setKontroller((prev) => prev.map((k) => (k.no === no ? { ...k, durum: yeniDurum } : k)))
  }

  function politikaToggle(id) {
    setPolitikalar((prev) => prev.map((p) => (p.id === id ? { ...p, aktif: !p.aktif } : p)))
  }

  function politikayaGonder(kontrol) {
    setSecilenKontrol(kontrol)
    setSekme('brain')
  }

  function compassaGit(kontrolNo) {
    setOdakKontrol(kontrolNo)
    setSekme('uyum')
  }

  // SIEM alarmından vaka oluştur (veya mevcut vakaya git)
  function vakaOlustur(alarm) {
    if (alarm.vakaId) {
      setOdakVaka(alarm.vakaId)
    } else {
      const mevcutNo = vakalar
        .map((v) => parseInt(v.no.split('-').pop(), 10))
        .filter((n) => !isNaN(n))
      const siradaki = (Math.max(0, ...mevcutNo) + 1).toString().padStart(3, '0')
      const yeniNo = `VAKA-2026-${siradaki}`
      const yeni = {
        no: yeniNo,
        baslik: `${alarm.host} — ${alarm.baslik}`,
        onem: alarm.onem,
        host: alarm.host,
        kullanici: alarm.kullanici,
        analist: 'Atlas / SOC Ekibi',
        durum: 'acik',
        acilis: alarm.zaman,
        kapanis: null,
        ssb: '10.1',
        ozet: 'SIEM alarmından otomatik oluşturuldu; triyaj tamamlandı, inceleme sürüyor.',
        timeline: [
          { t: alarm.zaman, tur: 'tespit', metin: `SIEM: ${alarm.baslik} (${alarm.mitre.kod}).` },
          { t: alarm.zaman, tur: 'triyaj', metin: `Atlas triyajı: ${alarm.onem} önem doğrulandı, vaka açıldı.` },
        ],
      }
      setVakalar((prev) => [yeni, ...prev])
      setAlarmlar((prev) =>
        prev.map((a) => (a.id === alarm.id ? { ...a, vakaId: yeniNo, durum: 'inceleniyor' } : a))
      )
      setOdakVaka(yeniNo)
    }
    setOlayAltSekme('vakalar')
    setSekme('olaylar')
  }

  function vakaTimelineEkle(vakaNo, adim) {
    setVakalar((prev) =>
      prev.map((v) => (v.no === vakaNo ? { ...v, timeline: [...v.timeline, adim] } : v))
    )
  }

  function sgbBildir(id) {
    setSgbBildirimler((prev) =>
      prev.map((b) => (b.id === id ? { ...b, durum: 'bildirildi', tarih: FIRMA.raporTarihi } : b))
    )
  }

  function someYeGit() {
    setOlayAltSekme('some')
    setSekme('olaylar')
  }

  // İlk açılışta tanıtım turu (bir kez otomatik)
  useEffect(() => {
    try {
      if (!localStorage.getItem(TUR_ANAHTAR)) {
        setTurAdim(0)
        setTurAktif(true)
      }
    } catch (e) {
      /* localStorage yoksa turu atla */
    }
  }, [])

  function turBaslat() {
    setGorunum('yonetici')
    setTurAdim(0)
    setTurAktif(true)
  }
  function turKapat() {
    setTurAktif(false)
    try {
      localStorage.setItem(TUR_ANAHTAR, '1')
    } catch (e) {
      /* yoksay */
    }
  }
  function turIleri() {
    setTurAdim((i) => Math.min(i + 1, TUR_ADIMLAR.length - 1))
  }
  function turGeri() {
    setTurAdim((i) => Math.max(i - 1, 0))
  }

  function detaylariGor(hedefSekme) {
    setGorunum('uzman')
    setSekme(hedefSekme)
  }

  const turHedefi = turAktif && gorunum === 'yonetici' ? TUR_ADIMLAR[turAdim].target : null

  const ortak = {
    kontroller,
    etkinListe,
    kapsamKontroller,
    hedefSeviye,
    setHedefSeviye,
    genelSkor,
    dizinSeti,
    durumDegistir,
    politikayaGonder,
    setSekme,
  }

  // ===== YÖNETİCİ (PATRON) GÖRÜNÜMÜ — varsayılan =====
  if (gorunum === 'yonetici') {
    return (
      <div className="min-h-screen">
        <header className="no-print flex items-center justify-between border-b border-ink-700 bg-ink-900/60 px-8 py-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-lg font-black text-ink-950">
              B
            </div>
            <div>
              <div className="text-[15px] font-bold leading-tight tracking-tight">
                BilSec <span className="text-accent-400">Guardian</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Yönetici Görünümü
              </div>
            </div>
          </div>
          <ModTogglesi gorunum={gorunum} setGorunum={setGorunum} />
        </header>

        <main className="px-8 py-8">
          <Yonetici
            genelSkor={genelSkor}
            kapsamKontroller={kapsamKontroller}
            alarmlar={alarmlar}
            vakalar={vakalar}
            edgeServisler={EDGE_SERVISLER}
            edgeSertifikalar={EDGE_SERTIFIKALAR}
            detaylariGor={detaylariGor}
            tourTarget={turHedefi}
            onTurBaslat={turBaslat}
          />
        </main>

        {turAktif && (
          <Tour step={turAdim} onNext={turIleri} onPrev={turGeri} onClose={turKapat} />
        )}
      </div>
    )
  }

  // ===== UZMAN (TEKNİK) GÖRÜNÜMÜ =====
  return (
    <div className="flex min-h-screen">
      {/* Sol menü */}
      <aside className="no-print fixed inset-y-0 left-0 flex w-64 flex-col border-r border-ink-700 bg-ink-900/80 px-4 py-6 backdrop-blur">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-lg font-black text-ink-950">
              B
            </div>
            <div>
              <div className="text-[15px] font-bold leading-tight tracking-tight">
                BilSec <span className="text-accent-400">Guardian</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Uzman Görünümü
              </div>
            </div>
          </div>
          <button
            onClick={() => setGorunum('yonetici')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-ink-600 py-2 text-xs font-medium text-slate-300 transition hover:border-accent-500 hover:text-accent-400"
          >
            ← Yönetici Görünümüne dön
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {SEKMELER.map((s) => {
            const aktif = sekme === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSekme(s.id)}
                className={
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ' +
                  (aktif
                    ? 'bg-accent-500/15 text-accent-400'
                    : 'text-slate-300 hover:bg-ink-800 hover:text-white')
                }
              >
                <span className="text-base">{s.ikon}</span>
                <span>{s.ad}</span>
                {s.vurgu && (
                  <span className="ml-auto rounded bg-accent-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent-400">
                    AI
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-4 rounded-lg border border-ink-700 bg-ink-850 p-3">
          <div className="text-[11px] font-semibold text-slate-300">{FIRMA.ad}</div>
          <div className="mt-0.5 text-[10px] text-slate-500">{FIRMA.sektor}</div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>{FIRMA.personel} personel</span>
            <span>{FIRMA.konum}</span>
          </div>
        </div>
      </aside>

      {/* İçerik */}
      <main className="print-full ml-64 flex-1 px-8 py-6">
        {sekme === 'dashboard' && <Dashboard {...ortak} alarmlar={alarmlar} vakalar={vakalar} />}
        {sekme === 'uyum' && (
          <Compliance {...ortak} odakKontrol={odakKontrol} setOdakKontrol={setOdakKontrol} />
        )}
        {sekme === 'kimlik' && (
          <Directory
            politikalar={politikalar}
            politikaToggle={politikaToggle}
            dizinSeti={dizinSeti}
            hedefSeviye={hedefSeviye}
            setHedefSeviye={setHedefSeviye}
            compassaGit={compassaGit}
          />
        )}
        {sekme === 'altyapi' && <Edge compassaGit={compassaGit} />}
        {sekme === 'izleme' && (
          <Siem alarmlar={alarmlar} setAlarmlar={setAlarmlar} vakaOlustur={vakaOlustur} />
        )}
        {sekme === 'olaylar' && (
          <Incidents
            vakalar={vakalar}
            alarmlar={alarmlar}
            odakVaka={odakVaka}
            setOdakVaka={setOdakVaka}
            altSekme={olayAltSekme}
            setAltSekme={setOlayAltSekme}
            vakaTimelineEkle={vakaTimelineEkle}
            sgbBildirimler={sgbBildirimler}
            sgbBildir={sgbBildir}
            fidyeyeGit={() => setSekme('fidye')}
            compassaGit={compassaGit}
          />
        )}
        {sekme === 'brain' && (
          <Brain
            {...ortak}
            secilenKontrol={secilenKontrol}
            setSecilenKontrol={setSecilenKontrol}
          />
        )}
        {sekme === 'fidye' && <Ransomware {...ortak} someYeGit={someYeGit} />}
        {sekme === 'rapor' && <Report {...ortak} />}
      </main>
    </div>
  )
}

function ModTogglesi({ gorunum, setGorunum }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-slate-500 sm:inline">Görünüm:</span>
      <div className="flex rounded-lg border border-ink-700 bg-ink-850 p-0.5">
        <button
          onClick={() => setGorunum('yonetici')}
          className={
            'rounded-md px-3 py-1.5 text-xs font-semibold transition ' +
            (gorunum === 'yonetici' ? 'bg-accent-500 text-ink-950' : 'text-slate-400 hover:text-white')
          }
        >
          Yönetici
        </button>
        <button
          onClick={() => setGorunum('uzman')}
          className={
            'rounded-md px-3 py-1.5 text-xs font-semibold transition ' +
            (gorunum === 'uzman' ? 'bg-accent-500 text-ink-950' : 'text-slate-400 hover:text-white')
          }
        >
          Uzman
        </button>
      </div>
    </div>
  )
}
