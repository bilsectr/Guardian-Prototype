import { useMemo } from 'react'
import { FIRMA, KATEGORILER, SEVIYELER } from '../data/seed.js'
import {
  kategoriBazindaKapsama,
  durumSayilari,
  hazirlikDurumu,
} from '../lib/scoring.js'
import { Card, AccentButton, DurumBadge, SeviyeBadge } from './ui.jsx'
import { Header } from './Dashboard.jsx'

export default function Report({ kapsamKontroller, genelSkor, hedefSeviye }) {
  const katKapsama = useMemo(
    () => kategoriBazindaKapsama(kapsamKontroller, KATEGORILER),
    [kapsamKontroller]
  )
  const sayilar = durumSayilari(kapsamKontroller)
  const hazirlik = hazirlikDurumu(genelSkor)
  const eksikler = kapsamKontroller.filter((k) => k.durum === 'eksik')
  const kismiler = kapsamKontroller.filter((k) => k.durum === 'kismi')
  const dizinSayisi = kapsamKontroller.filter((k) => k.kaynak === 'directory').length

  return (
    <div className="space-y-6">
      <div className="no-print">
        <Header
          baslik="Uyum Raporu"
          altBaslik="SSB Siber Hijyen-KOBİ Uyum Durum Raporu — yazdır/PDF çıktısı alınabilir"
        />
        <div className="mt-4 flex justify-end">
          <AccentButton onClick={() => window.print()}>🖨️ Yazdır / PDF olarak kaydet</AccentButton>
        </div>
      </div>

      {/* Rapor gövdesi */}
      <Card className="mx-auto max-w-4xl bg-white p-10 text-slate-800 print:shadow-none">
        {/* Başlık */}
        <div className="flex items-start justify-between border-b-2 border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0fa88f] text-lg font-black text-white">
                B
              </div>
              <span className="text-lg font-bold text-slate-900">BilSec Guardian</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              SSB Siber Hijyen-KOBİ Uyum Durum Raporu
            </h1>
            <p className="mt-1 text-sm text-slate-500">{FIRMA.denetci}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Rapor Tarihi: {FIRMA.raporTarihi}</div>
            <div className="mt-1">Belge No: BSG-RPT-2026-0729</div>
          </div>
        </div>

        {/* Firma bilgisi */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <Bilgi k="Kuruluş" v={FIRMA.ad} />
          <Bilgi k="Sektör" v={FIRMA.sektor} />
          <Bilgi k="Personel Sayısı" v={`${FIRMA.personel} kişi`} />
          <Bilgi k="Konum" v={FIRMA.konum} />
          <Bilgi k="Hedef Seviye" v={SEVIYELER[hedefSeviye].ad} />
          <Bilgi
            k="Değerlendirilen Kontrol"
            v={`${kapsamKontroller.length} adet (${dizinSayisi}'i BilSec Directory ile otomatik)`}
          />
        </div>

        {/* Skor özeti */}
        <div className="mt-8 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Genel Uyum Skoru</div>
            <div className="text-4xl font-bold text-slate-900">%{genelSkor}</div>
            <div
              className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: hazirlik.renk }}
            >
              {hazirlik.ad}
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <Ozet n={sayilar.uygun} l="Uygun" c="#0fa88f" />
            <Ozet n={sayilar.kismi} l="Kısmi" c="#d97706" />
            <Ozet n={sayilar.eksik} l="Eksik" c="#dc2626" />
          </div>
        </div>

        {/* Kategori tablosu */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-900">Kategori Bazında Kapsama</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="py-2">Kategori</th>
                <th className="py-2 text-center">Kontrol</th>
                <th className="py-2 text-center">Kapsama</th>
                <th className="w-1/3 py-2">Durum</th>
              </tr>
            </thead>
            <tbody>
              {katKapsama
                .filter((k) => k.adet > 0)
                .map((k) => (
                  <tr key={k.id} className="border-b border-slate-100">
                    <td className="py-2 text-slate-700">
                      {k.id}. {k.ad}
                    </td>
                    <td className="py-2 text-center text-slate-500">{k.adet}</td>
                    <td className="py-2 text-center font-semibold text-slate-800">%{k.yuzde}</td>
                    <td className="py-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${k.yuzde}%`,
                            backgroundColor:
                              k.yuzde >= 80 ? '#0fa88f' : k.yuzde >= 50 ? '#d97706' : '#dc2626',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Eksik kontroller */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-900">
            Eksik Kontroller ({eksikler.length})
          </h2>
          <ul className="space-y-1.5 text-sm">
            {eksikler.map((k) => (
              <li key={k.no} className="flex items-start gap-2">
                <span className="mt-0.5 font-mono text-xs text-slate-400">{k.no}</span>
                <span className="rounded bg-red-50 px-1.5 text-[10px] font-bold text-red-600">
                  {SEVIYELER[k.seviye].kod}
                </span>
                <span className="flex-1 text-slate-700">{k.metin}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Öneriler */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-2 text-sm font-bold text-slate-900">Öneriler ve Sonraki Adımlar</h2>
          <ol className="ml-4 list-decimal space-y-1 text-sm text-slate-700">
            <li>
              Düşük eforlu kontroller (e-posta 2FA, veri imha prosedürü, adli sicil kontrolü) ilk 30
              gün içinde kapatılmalıdır.
            </li>
            <li>
              Veri güvenliği ve bilgi güvenliği politikaları yazılı hale getirilmeli, BilSec Brain
              taslakları temel alınmalıdır.
            </li>
            <li>
              Kısmi durumdaki {kismiler.length} kontrol için eksik kanıtlar tamamlanarak "Uygun"
              seviyesine çıkarılmalıdır.
            </li>
            <li>
              Restore testleri periyodik (üç ayda bir) hale getirilerek fidye yazılımı direnci
              sürdürülmelidir.
            </li>
          </ol>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-4 text-center text-[11px] text-slate-400">
          Bu rapor BilSec Guardian tarafından otomatik oluşturulmuştur · SSB Siber Hijyen-KOBİ
          kriterleri temel alınmıştır · {FIRMA.raporTarihi}
        </div>
      </Card>
    </div>
  )
}

function Bilgi({ k, v }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{k}</div>
      <div className="font-medium text-slate-800">{v}</div>
    </div>
  )
}

function Ozet({ n, l, c }) {
  return (
    <div>
      <div className="text-2xl font-bold" style={{ color: c }}>
        {n}
      </div>
      <div className="text-xs text-slate-500">{l}</div>
    </div>
  )
}
