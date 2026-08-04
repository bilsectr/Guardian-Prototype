import { SEVIYE_KAPSAM, DURUMLAR } from '../data/seed.js'
import { DIZIN_POLITIKALARI } from '../data/directory.js'

// Etkin dizin politikalarının otomatik karşıladığı SSB kontrol no'ları (Set).
export function dizinKapsamSeti(politikalar = DIZIN_POLITIKALARI) {
  const set = new Set()
  politikalar.filter((p) => p.aktif).forEach((p) => p.karsilar.forEach((no) => set.add(no)))
  return set
}

// Kontrol no → otomatik kaynak eşlemesi ('directory' | 'altyapi' | 'olay').
// Dizin politikaları, yerinde altyapı servisleri ve kapatılmış vakalar kontrolleri besler.
export function otomatikKaynaklar(
  politikalar = DIZIN_POLITIKALARI,
  vakalar = [],
  altyapiServisleri = []
) {
  const map = new Map()
  // 1) Dizin politikaları
  politikalar
    .filter((p) => p.aktif)
    .forEach((p) => p.karsilar.forEach((no) => map.set(no, 'directory')))
  // 2) Yerinde altyapı servisleri (durmuş servis beslemez)
  altyapiServisleri
    .filter((s) => s.durum !== 'durdu')
    .forEach((s) => (s.karsilar || []).forEach((no) => {
      if (!map.has(no)) map.set(no, 'altyapi')
    }))
  // 3) Kapatılmış bir vaka varsa Olay İhlal Yönetimi (SSB 10.1) otomatik karşılanır.
  const kapaliVaka = vakalar.filter((v) => v.durum === 'kapali')
  kapaliVaka.forEach((v) => {
    if (v.ssb && !map.has(v.ssb)) map.set(v.ssb, 'olay')
  })
  return map
}

// Manuel kontrol durumlarına otomatik kaynak katmanını uygular.
// Kapsamdaki kontroller kaynak='directory'|'olay' ve durum='uygun' olur.
export function etkinKontroller(kontroller, kaynakMap) {
  const map = kaynakMap instanceof Map ? kaynakMap : new Map()
  return kontroller.map((k) =>
    map.has(k.no)
      ? { ...k, durum: 'uygun', kaynak: map.get(k.no) }
      : { ...k, kaynak: 'manuel' }
  )
}

// Bir hedef seviyeye göre kapsam içindeki kontroller (artımlı model).
export function kapsamdakiKontroller(kontroller, hedefSeviye) {
  const seviyeler = SEVIYE_KAPSAM[hedefSeviye] || ['B']
  return kontroller.filter((k) => seviyeler.includes(k.seviye))
}

// Kapsama yüzdesi: uygun=1, kısmi=0.5, eksik=0.
export function kapsamaYuzdesi(kontroller) {
  if (!kontroller.length) return 0
  const toplam = kontroller.reduce((acc, k) => acc + (DURUMLAR[k.durum]?.puan ?? 0), 0)
  return Math.round((toplam / kontroller.length) * 100)
}

// Durum sayımları.
export function durumSayilari(kontroller) {
  return kontroller.reduce(
    (acc, k) => {
      acc[k.durum] = (acc[k.durum] || 0) + 1
      return acc
    },
    { uygun: 0, kismi: 0, eksik: 0 }
  )
}

// Kategori bazında kapsama (grafik için).
export function kategoriBazindaKapsama(kontroller, kategoriler) {
  return kategoriler.map((kat) => {
    const list = kontroller.filter((k) => k.kat === kat.id)
    return {
      id: kat.id,
      ad: kat.ad,
      kisaAd: kat.ad.length > 16 ? kat.ad.slice(0, 15) + '…' : kat.ad,
      yuzde: kapsamaYuzdesi(list),
      adet: list.length,
    }
  })
}

// Belgelendirmeye hazırlık durumu.
export function hazirlikDurumu(yuzde) {
  if (yuzde >= 85) return { ad: 'Belgeye Hazır', renk: '#16c9ac' }
  if (yuzde >= 65) return { ad: 'Belgeye Yaklaşıyor', renk: '#f59e0b' }
  return { ad: 'İyileştirme Gerekli', renk: '#ef4444' }
}
