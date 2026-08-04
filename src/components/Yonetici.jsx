import { useMemo } from 'react'
import { FIRMA, YEDEKLEME } from '../data/seed.js'
import { durumSayilari, hazirlikDurumu } from '../lib/scoring.js'
import { Card } from './ui.jsx'

// Trafik ışığı durumları
const ISIK = {
  yesil: { renk: '#16c9ac', baslik: 'Güvendesiniz', ikon: '✅' },
  sari: { renk: '#f59e0b', baslik: 'Dikkat gereken var', ikon: '⚠️' },
  kirmizi: { renk: '#ef4444', baslik: 'Acil durum', ikon: '🚨' },
}

export default function Yonetici({
  genelSkor,
  kapsamKontroller,
  alarmlar = [],
  vakalar = [],
  edgeServisler = [],
  edgeSertifikalar = [],
  detaylariGor,
  tourTarget,
  onTurBaslat,
}) {
  const yedekServis = edgeServisler.find((s) => s.id === 'yedek')
  const servisSorunlu = edgeServisler.filter((s) => s.durum === 'durdu').length
  const dolacakSertifika = edgeSertifikalar.filter((c) => c.durum === 'uyari')
  const sayilar = durumSayilari(kapsamKontroller)
  const eksikVarmi = sayilar.eksik + sayilar.kismi
  const otoKarsilanan = kapsamKontroller.filter((k) => k.kaynak && k.kaynak !== 'manuel').length

  const kritikAcik = alarmlar.filter((a) => a.onem === 'kritik' && a.durum !== 'kapatildi').length
  const aktifAlarm = alarmlar.filter((a) => a.durum !== 'kapatildi').length
  const acikVaka = vakalar.filter((v) => v.durum === 'acik').length

  const isikDurum = useMemo(() => {
    if (kritikAcik > 0 || acikVaka > 0 || aktifAlarm > 0) return 'sari'
    if (sayilar.eksik > 5) return 'sari'
    return 'yesil'
  }, [kritikAcik, acikVaka, aktifAlarm, sayilar.eksik])

  const isik = ISIK[isikDurum]
  const isikMetni =
    isikDurum === 'yesil'
      ? 'Şu anda dikkat gerektiren bir sorun yok. Sistemleriniz izleniyor ve korunuyor.'
      : `Son 24 saatte ${aktifAlarm} olay tespit edildi. BilSec otomatik müdahale etti; acil bir eyleminiz gerekmiyor — durum inceleniyor.`

  const hazir = hazirlikDurumu(genelSkor)

  // Patron diliyle "bugün yapılanlar"
  const yapilanlar = [
    {
      ikon: '🛡️',
      metin: `${alarmlar.length} tehdit değerlendirildi${
        kritikAcik > 0 ? ' ve bir fidye saldırısı anında durduruldu' : ''
      } — bir çalışan bilgisayarı korundu.`,
    },
    {
      ikon: '💾',
      metin: `Değiştirilemez güvenli yedekleriniz alındı ve geri yükleme testi ${YEDEKLEME.sonRestoreSonuc.toLowerCase()} oldu.`,
    },
    {
      ikon: '📋',
      metin: `${otoKarsilanan} uyum maddesi sizin için otomatik karşılandı — elle iş yapmanıza gerek kalmadı.`,
    },
    {
      ikon: '🔐',
      metin: 'Çalışan hesapları ve cihazlar güvenlik politikalarıyla korundu; iki adımlı giriş etkin.',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Karşılama */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Merhaba 👋</h1>
          <p className="mt-1 text-sm text-slate-400">
            {FIRMA.ad} · işletmenizin güvenlik özeti — {FIRMA.raporTarihi}
          </p>
        </div>
        <button
          onClick={onTurBaslat}
          className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-accent-500 hover:text-accent-400"
        >
          ↻ Tanıtım turunu izle
        </button>
      </div>

      {/* 1) Güvenlik Durumu — trafik ışığı (hero) */}
      <Card
        id="kart-durum"
        className={
          'p-7 transition ' +
          (tourTarget === 'kart-durum' ? 'relative z-[60] ring-2 ring-accent-400' : '')
        }
      >
        <div className="flex flex-wrap items-center gap-6">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-5xl"
            style={{ backgroundColor: isik.renk + '22', border: `3px solid ${isik.renk}` }}
          >
            {isik.ikon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-widest text-slate-500">Güvenlik Durumu</div>
            <div className="mt-1 text-3xl font-bold" style={{ color: isik.renk }}>
              {isik.baslik}
            </div>
            <p className="mt-2 max-w-xl text-sm text-slate-300">{isikMetni}</p>
          </div>
          <DetayBtn onClick={() => detaylariGor('izleme')} />
        </div>
      </Card>

      {/* 2) Belgeye Hazırlık + 4) Sıradaki Adım */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          id="kart-belge"
          className={
            'flex flex-col p-6 transition ' +
            (tourTarget === 'kart-belge' ? 'relative z-[60] ring-2 ring-accent-400' : '')
          }
        >
          <div className="text-xs uppercase tracking-widest text-slate-500">Belgeye Hazırlık</div>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e2b4a" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={hazir.renk}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(genelSkor / 100) * 264} 264`}
                />
              </svg>
              <span className="absolute text-xl font-bold">%{genelSkor}</span>
            </div>
            <p className="text-sm text-slate-300">
              SSB Siber Hijyen belgeniz için <b className="text-white">%{genelSkor}</b> hazırsınız.
              Kalan <b className="text-white">{sayilar.eksik}</b> madde için önerilerimiz hazır.
            </p>
          </div>
          <div className="mt-auto pt-4">
            <DetayBtn onClick={() => detaylariGor('uyum')} kucuk />
          </div>
        </Card>

        <Card
          id="kart-adim"
          className={
            'flex flex-col p-6 transition ' +
            (tourTarget === 'kart-adim' ? 'relative z-[60] ring-2 ring-accent-400' : '')
          }
        >
          <div className="text-xs uppercase tracking-widest text-slate-500">Sıradaki Adım</div>
          <div className="mt-3 flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <p className="text-sm text-slate-200">
              <b className="text-white">Bu hafta:</b> 2 çalışanınıza 15 dakikalık güvenlik
              farkındalık eğitimi atayın. Böylece belgeye hazırlığınız artar ve oltalama riski düşer.
            </p>
          </div>
          <div className="mt-auto pt-4">
            <DetayBtn onClick={() => detaylariGor('uyum')} kucuk metin="Eğitim maddesini gör" />
          </div>
        </Card>
      </div>

      {/* 3) BilSec Bugün Sizin İçin Ne Yaptı */}
      <Card
        id="kart-yapilan"
        className={
          'p-6 transition ' +
          (tourTarget === 'kart-yapilan' ? 'relative z-[60] ring-2 ring-accent-400' : '')
        }
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              BilSec Bugün Sizin İçin Ne Yaptı
            </div>
            <div className="mt-0.5 text-sm text-slate-400">
              Siz uğraşmadınız — teknik işleri BilSec arka planda halletti.
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-accent-400">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-400" />
            7/24 aktif
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {yapilanlar.map((y, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900/40 p-4"
            >
              <span className="text-xl">{y.ikon}</span>
              <p className="text-sm text-slate-200">{y.metin}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <DetayBtn onClick={() => detaylariGor('olaylar')} kucuk metin="Yapılan tüm işleri gör" />
        </div>
      </Card>

      {/* 5) Altyapınız sağlıklı */}
      <Card
        id="kart-altyapi"
        className={
          'p-6 transition ' +
          (tourTarget === 'kart-altyapi' ? 'relative z-[60] ring-2 ring-accent-400' : '')
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🖥️</span>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Altyapınız</div>
              <div className="mt-0.5 text-lg font-bold text-accent-400">
                {servisSorunlu === 0 ? 'Altyapınız sağlıklı' : 'Altyapıda dikkat gereken var'}
              </div>
            </div>
          </div>
          <DetayBtn onClick={() => detaylariGor('altyapi')} kucuk />
        </div>
        <div className="mt-4 space-y-2">
          <GuvenceSatiri
            ikon="✓"
            renk="#16c9ac"
            metin={`Gece yedeğiniz alındı (${yedekServis ? 'bu sabah 03:12' : 'başarılı'}) ve geri yükleme testi başarılı.`}
          />
          <GuvenceSatiri
            ikon="✓"
            renk="#16c9ac"
            metin={`Tüm servisleriniz çalışıyor (internet, dosya paylaşımı, güvenlik duvarı, antivirüs).`}
          />
          {dolacakSertifika.length > 0 && (
            <GuvenceSatiri
              ikon="⚠"
              renk="#f59e0b"
              metin={`${dolacakSertifika.length} güvenlik sertifikası ${dolacakSertifika[0].kalanGun} gün içinde yenilenmeli — biz hallediyoruz, sizin bir şey yapmanıza gerek yok.`}
            />
          )}
        </div>
      </Card>
    </div>
  )
}

function GuvenceSatiri({ ikon, renk, metin }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900/40 p-3">
      <span className="text-sm font-bold" style={{ color: renk }}>
        {ikon}
      </span>
      <p className="text-sm text-slate-200">{metin}</p>
    </div>
  )
}

function DetayBtn({ onClick, kucuk, metin = 'Detayları gör' }) {
  return (
    <button
      onClick={onClick}
      className={
        'shrink-0 rounded-lg border border-ink-600 font-medium text-slate-300 transition hover:border-accent-500 hover:text-accent-400 ' +
        (kucuk ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm')
      }
    >
      {metin} →
    </button>
  )
}
