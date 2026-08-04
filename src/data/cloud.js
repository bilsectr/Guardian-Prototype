// BilSec Guardian — Bulut / Yönetilen CSIRT (SOC) tohum verisi (mock).
// Bu katman, müşteri lokasyonundaki BilSec Edge cihazlarını 7/24 izleyen
// merkezi BilSec bulut SOC'unun (Managed CSIRT-as-a-Service) çok-müşterili
// görünümüdür. Gerçek çok-kiracılı altyapı yoktur; ölçek hikâyesini gösterir.

// SOC hizmet paketleri (SLA seviyeleri)
export const HIZMET_PAKETLERI = {
  standart: { kod: 'standart', ad: 'Standart', renk: '#38bdf8', triyajSla: 30 }, // dk
  gelismis: { kod: 'gelismis', ad: 'Gelişmiş', renk: '#a78bfa', triyajSla: 15 },
  kritik: { kod: 'kritik', ad: 'Kritik Altyapı', renk: '#16c9ac', triyajSla: 10 },
}

// Edge cihaz bağlantı durumu (bulut ile heartbeat)
export const EDGE_DURUMLARI = {
  cevrimici: { kod: 'cevrimici', ad: 'Çevrimiçi', renk: '#16c9ac' },
  gecikmeli: { kod: 'gecikmeli', ad: 'Senkron Gecikmeli', renk: '#f59e0b' },
  cevrimdisi: { kod: 'cevrimdisi', ad: 'Çevrimdışı', renk: '#ef4444' },
}

// Yönetilen müşteri portföyü. Her müşterinin lokasyonunda bir BilSec Edge cihazı var.
// "aktif" = mevcut demodaki tek-kiracılı ekranların (Örnek Savunma A.Ş.) bağlı olduğu müşteri.
export const MUSTERILER = [
  {
    id: 'ornek-savunma',
    ad: 'Örnek Savunma Sanayi A.Ş.',
    sektor: 'Savunma Sanayi Tedarikçisi',
    konum: 'Ankara',
    personel: 42,
    paket: 'kritik',
    aktif: true, // demodaki tek-kiracılı ekranlar bu müşteriye ait
    edge: { seri: 'EDGE-ANK-0417', durum: 'cevrimici', sonSenkron: '2 dk önce', surum: 'v2.4.1' },
    uyumSkor: 80,
    acikAlarm: 2,
    kritikAlarm: 1,
    acikVaka: 1,
  },
  {
    id: 'anadolu-enerji',
    ad: 'Anadolu Enerji Dağıtım A.Ş.',
    sektor: 'Kritik Altyapı — Enerji',
    konum: 'Kayseri',
    personel: 88,
    paket: 'kritik',
    aktif: false,
    edge: { seri: 'EDGE-KAY-0231', durum: 'cevrimici', sonSenkron: '1 dk önce', surum: 'v2.4.1' },
    uyumSkor: 91,
    acikAlarm: 1,
    kritikAlarm: 0,
    acikVaka: 0,
  },
  {
    id: 'ege-lojistik',
    ad: 'Ege Lojistik ve Depolama Ltd.',
    sektor: 'Lojistik / KOBİ',
    konum: 'İzmir',
    personel: 26,
    paket: 'standart',
    aktif: false,
    edge: { seri: 'EDGE-IZM-0588', durum: 'gecikmeli', sonSenkron: '38 dk önce', surum: 'v2.3.6' },
    uyumSkor: 64,
    acikAlarm: 3,
    kritikAlarm: 0,
    acikVaka: 1,
  },
  {
    id: 'marmara-saglik',
    ad: 'Marmara Sağlık Grubu',
    sektor: 'Sağlık / KVKK yoğun',
    konum: 'İstanbul',
    personel: 130,
    paket: 'gelismis',
    aktif: false,
    edge: { seri: 'EDGE-IST-0102', durum: 'cevrimici', sonSenkron: '3 dk önce', surum: 'v2.4.1' },
    uyumSkor: 77,
    acikAlarm: 4,
    kritikAlarm: 1,
    acikVaka: 2,
  },
  {
    id: 'baskent-belediye',
    ad: 'Başkent İlçe Belediyesi',
    sektor: 'Kamu / Yerel Yönetim',
    konum: 'Ankara',
    personel: 210,
    paket: 'gelismis',
    aktif: false,
    edge: { seri: 'EDGE-ANK-0779', durum: 'cevrimdisi', sonSenkron: '3 sa 12 dk önce', surum: 'v2.4.0' },
    uyumSkor: 58,
    acikAlarm: 0,
    kritikAlarm: 0,
    acikVaka: 0,
  },
]

// Bulut SOC ekibi (görev nöbeti). Görevler ayrılığı: müşterinin BT'si değil, bağımsız operatör.
export const SOC_EKIBI = [
  { ad: 'A. Yıldız', rol: 'Kıdemli SOC Analisti (Nöbetçi)', aktifVaka: 3, durum: 'nobette' },
  { ad: 'B. Kaya', rol: 'Olay Müdahale (DFIR)', aktifVaka: 2, durum: 'nobette' },
  { ad: 'C. Aydın', rol: 'Triyaj Analisti', aktifVaka: 4, durum: 'nobette' },
  { ad: 'Atlas (AI)', rol: 'Otomatik Triyaj Ajanı', aktifVaka: '∞', durum: 'nobette' },
]

// Çok-müşterili canlı alarm akışı (bulut SOC'a düşen, müşteri etiketli).
export const BULUT_ALARM_AKISI = [
  { zaman: '29.07.2026 14:32', musteri: 'Örnek Savunma A.Ş.', host: 'IK-PC-07', baslik: 'Şüpheli toplu dosya şifreleme (fidye)', onem: 'kritik', slaKalan: 'triyaj tamam', durum: 'vaka' },
  { zaman: '29.07.2026 14:05', musteri: 'Marmara Sağlık Grubu', host: 'LAB-PC-11', baslik: 'Hasta verisine olağan dışı toplu erişim', onem: 'kritik', slaKalan: '6 dk', durum: 'triyaj' },
  { zaman: '29.07.2026 13:48', musteri: 'Ege Lojistik Ltd.', host: 'DEPO-PC-02', baslik: 'Beyaz listede olmayan uzak masaüstü', onem: 'yuksek', slaKalan: '12 dk', durum: 'yeni' },
  { zaman: '29.07.2026 13:20', musteri: 'Anadolu Enerji A.Ş.', host: 'SCADA-GW-01', baslik: 'OT ağında yetkisiz tarama denemesi', onem: 'yuksek', slaKalan: '4 dk', durum: 'triyaj' },
  { zaman: '29.07.2026 12:05', musteri: 'Örnek Savunma A.Ş.', host: 'srv-dosya01', baslik: 'Olası C2 beacon trafiği', onem: 'orta', slaKalan: '22 dk', durum: 'yeni' },
  { zaman: '29.07.2026 11:41', musteri: 'Marmara Sağlık Grubu', host: 'MUH-PC-05', baslik: 'Başarısız oturum yoğunluğu', onem: 'orta', slaKalan: '18 dk', durum: 'yeni' },
]

// SGB / USOM'a bildirim kuyruğu (çok-müşterili) — SOME hizmetinin çıktısı.
export const SGB_KUYRUK = [
  { musteri: 'Örnek Savunma A.Ş.', olay: 'Fidye yazılımı şüphesi (IK-PC-07)', durum: 'bekliyor' },
  { musteri: 'Anadolu Enerji A.Ş.', olay: 'OT tarama denemesi (SCADA-GW-01)', durum: 'hazirlaniyor' },
  { musteri: 'Ege Lojistik Ltd.', olay: 'Yetkisiz RDP (DEPO-PC-02)', durum: 'hazirlaniyor' },
]
