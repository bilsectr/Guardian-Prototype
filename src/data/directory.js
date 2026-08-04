// BilSec Directory — Kimlik ve Erişim Yönetimi tohum verisi (mock).
// Gerçek Samba/LDAP/Kerberos bağlantısı yoktur; tüm veriler yereldir.

export const OU_AGACI = [
  { id: 'yonetim', ad: 'Yönetim' },
  { id: 'muhasebe', ad: 'Muhasebe-Finans' },
  { id: 'muhendislik', ad: 'Mühendislik / Ar-Ge' },
  { id: 'uretim', ad: 'Üretim' },
  { id: 'bt', ad: 'Bilgi Teknolojileri' },
  { id: 'satis', ad: 'Satış' },
  { id: 'ik', ad: 'İnsan Kaynakları' },
]

// Güvenlik grupları
export const GRUPLAR = [
  { id: 'GRP-Yonetim', ad: 'GRP-Yonetim', aciklama: 'Üst yönetim erişimleri', hassas: false },
  { id: 'GRP-Muhasebe', ad: 'GRP-Muhasebe', aciklama: 'Mali kayıtlara erişim', hassas: false },
  { id: 'GRP-ArGe-Gizli', ad: 'GRP-ArGe-Gizli', aciklama: 'Ana yüklenici gizli proje verileri', hassas: true },
  { id: 'GRP-BT-Yonetici', ad: 'GRP-BT-Yonetici', aciklama: 'Etki alanı yönetici yetkileri', hassas: true },
  { id: 'GRP-Uzaktan-Erisim', ad: 'GRP-Uzaktan-Erisim', aciklama: 'VPN / uzaktan bağlantı yetkisi', hassas: false },
]

// ~14 kullanıcı. sorun alanları: mfaPasif, gereksizAdmin, atilHesap
export const KULLANICILAR = [
  { ad: 'Ahmet Yıldırım', kullanici: 'ayildirim', ou: 'yonetim', gruplar: ['GRP-Yonetim'], mfa: true, yerelAdmin: false, sonGiris: '29.07.2026 08:41', durum: 'aktif' },
  { ad: 'Elif Kaya', kullanici: 'ekaya', ou: 'yonetim', gruplar: ['GRP-Yonetim'], mfa: true, yerelAdmin: false, sonGiris: '28.07.2026 17:22', durum: 'aktif' },
  { ad: 'Murat Şahin', kullanici: 'msahin', ou: 'muhasebe', gruplar: ['GRP-Muhasebe'], mfa: true, yerelAdmin: false, sonGiris: '29.07.2026 09:05', durum: 'aktif' },
  { ad: 'Zeynep Aydın', kullanici: 'zaydin', ou: 'muhasebe', gruplar: ['GRP-Muhasebe'], mfa: false, yerelAdmin: false, sonGiris: '29.07.2026 08:58', durum: 'aktif', sorun: 'mfaPasif' },
  { ad: 'Can Demirtaş', kullanici: 'cdemirtas', ou: 'muhendislik', gruplar: ['GRP-ArGe-Gizli', 'GRP-Uzaktan-Erisim'], mfa: true, yerelAdmin: false, sonGiris: '29.07.2026 07:50', durum: 'aktif' },
  { ad: 'Selin Öztürk', kullanici: 'sozturk', ou: 'muhendislik', gruplar: ['GRP-ArGe-Gizli'], mfa: true, yerelAdmin: false, sonGiris: '28.07.2026 19:10', durum: 'aktif' },
  { ad: 'Burak Aslan', kullanici: 'baslan', ou: 'muhendislik', gruplar: ['GRP-ArGe-Gizli'], mfa: true, yerelAdmin: true, sonGiris: '29.07.2026 08:33', durum: 'aktif', sorun: 'gereksizAdmin' },
  { ad: 'Deniz Koç', kullanici: 'dkoc', ou: 'uretim', gruplar: [], mfa: true, yerelAdmin: false, sonGiris: '29.07.2026 06:15', durum: 'aktif' },
  { ad: 'Hakan Çelik', kullanici: 'hcelik', ou: 'uretim', gruplar: [], mfa: true, yerelAdmin: false, sonGiris: '28.07.2026 22:40', durum: 'aktif' },
  { ad: 'Okan Er', kullanici: 'oer', ou: 'bt', gruplar: ['GRP-BT-Yonetici', 'GRP-Uzaktan-Erisim'], mfa: true, yerelAdmin: true, sonGiris: '29.07.2026 09:12', durum: 'aktif' },
  { ad: 'Gizem Arslan', kullanici: 'garslan', ou: 'bt', gruplar: ['GRP-BT-Yonetici'], mfa: true, yerelAdmin: true, sonGiris: '29.07.2026 08:20', durum: 'aktif' },
  { ad: 'Emre Doğan', kullanici: 'edogan', ou: 'satis', gruplar: ['GRP-Uzaktan-Erisim'], mfa: true, yerelAdmin: false, sonGiris: '27.07.2026 16:05', durum: 'aktif' },
  { ad: 'Merve Yılmaz', kullanici: 'myilmaz', ou: 'satis', gruplar: [], mfa: true, yerelAdmin: false, sonGiris: '18.04.2026 11:30', durum: 'aktif', sorun: 'atilHesap' },
  { ad: 'Mehmet Demir', kullanici: 'm.demir', ou: 'ik', gruplar: [], mfa: true, yerelAdmin: false, sonGiris: '29.07.2026 08:47', durum: 'aktif' },
  { ad: 'Aylin Şen', kullanici: 'asen', ou: 'ik', gruplar: [], mfa: true, yerelAdmin: false, sonGiris: '29.07.2026 09:01', durum: 'aktif' },
]

// ~10 etki alanına katılı bilgisayar
export const BILGISAYARLAR = [
  { ad: 'YON-PC-01', ou: 'yonetim', os: 'Windows 11 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '27.07.2026', sonGorulme: '29.07.2026 09:10', uyum: 'uyumlu' },
  { ad: 'MUH-PC-01', ou: 'muhasebe', os: 'Windows 11 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '26.07.2026', sonGorulme: '29.07.2026 09:02', uyum: 'uyumlu' },
  { ad: 'ARGE-PC-02', ou: 'muhendislik', os: 'Windows 11 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '28.07.2026', sonGorulme: '29.07.2026 08:55', uyum: 'uyumlu' },
  { ad: 'ARGE-PC-05', ou: 'muhendislik', os: 'Windows 10 Pro', bitlocker: false, antivirus: true, sonGuncelleme: '11.07.2026', sonGorulme: '29.07.2026 08:30', uyum: 'dikkat' },
  { ad: 'URETIM-PC-03', ou: 'uretim', os: 'Windows 10 Pro', bitlocker: false, antivirus: false, sonGuncelleme: '02.05.2026', sonGorulme: '28.07.2026 23:00', uyum: 'uyumsuz' },
  { ad: 'URETIM-PC-06', ou: 'uretim', os: 'Windows 10 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '25.07.2026', sonGorulme: '29.07.2026 06:20', uyum: 'uyumlu' },
  { ad: 'BT-PC-01', ou: 'bt', os: 'Windows 11 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '29.07.2026', sonGorulme: '29.07.2026 09:15', uyum: 'uyumlu' },
  { ad: 'SATIS-PC-04', ou: 'satis', os: 'Windows 11 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '24.07.2026', sonGorulme: '27.07.2026 16:10', uyum: 'uyumlu' },
  { ad: 'IK-PC-07', ou: 'ik', os: 'Windows 10 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '20.07.2026', sonGorulme: '29.07.2026 14:32', uyum: 'dikkat' },
  { ad: 'IK-PC-09', ou: 'ik', os: 'Windows 11 Pro', bitlocker: true, antivirus: true, sonGuncelleme: '26.07.2026', sonGorulme: '29.07.2026 09:00', uyum: 'uyumlu' },
]

// Dizin politikaları (grup ilkesi benzeri).
// "karsilar": bu politika etkinken otomatik "Uygun" sayılan SSB kontrol no'ları.
export const DIZIN_POLITIKALARI = [
  {
    id: 'pol-parola',
    ad: 'Parola Politikası',
    aciklama: 'Min. 8 karakter, karmaşık yapı, 90 günde bir zorunlu değişim.',
    kapsam: 'Tüm firma',
    aktif: true,
    karsilar: ['2.5', '2.7', '4.4'],
  },
  {
    id: 'pol-ekran',
    ad: 'Ekran Kilidi Politikası',
    aciklama: '10 dk hareketsizlikte otomatik kilit; girişte parola zorunlu.',
    kapsam: 'Tüm firma',
    aktif: true,
    karsilar: ['3.8'],
  },
  {
    id: 'pol-mfa',
    ad: 'MFA Zorunluluğu',
    aciklama: 'Tüm kullanıcı erişimlerinde iki faktörlü doğrulama.',
    kapsam: 'Tüm firma',
    aktif: true,
    karsilar: ['4.3'],
  },
  {
    id: 'pol-admin',
    ad: 'Yerel Yönetici Kısıtı',
    aciklama: 'Son kullanıcılarda yerel yönetici yetkisi kapalı; yalnızca BT ekibi.',
    kapsam: 'Yönetim, Muhasebe, Üretim, Satış, İK',
    aktif: true,
    karsilar: ['3.5'],
  },
  {
    id: 'pol-usb',
    ad: 'USB / Harici Disk Şifreleme',
    aciklama: 'BitLocker to Go zorunlu; şifresiz harici medya engelli.',
    kapsam: 'Tüm firma',
    aktif: true,
    karsilar: ['6.4'],
  },
  {
    id: 'pol-yazilim',
    ad: 'Yazılım Yükleme Kısıtı',
    aciklama: 'Yazılım kurulumu yalnızca yetkili BT personelince; lisanssız yazılım engelli.',
    kapsam: 'Tüm firma',
    aktif: true,
    karsilar: ['3.6', '9.3'],
  },
  {
    id: 'pol-giris-cikis',
    ad: 'İşe Giriş/Çıkış Otomasyonu',
    aciklama: 'Hesap açma/kapama ve göreve son verildiğinde yetki/varlık iadesi otomasyonu.',
    kapsam: 'Tüm firma',
    aktif: true,
    karsilar: ['1.4', '1.5'],
  },
]

export const KULLANICI_SORUNLARI = {
  mfaPasif: { etiket: 'MFA Pasif', renk: '#ef4444', ssb: '4.3' },
  gereksizAdmin: { etiket: 'Gereksiz Yerel Yönetici', renk: '#f59e0b', ssb: '3.5' },
  atilHesap: { etiket: '90+ gün atıl hesap', renk: '#f59e0b', ssb: '1.5' },
}
