// BilSec Guardian — Tanıtım Turu (patron dilinde, jargonsuz)
export const TUR_ADIMLAR = [
  {
    target: null,
    baslik: "BilSec Guardian'a hoş geldiniz",
    metin: 'Bu ekran, işletmenizin siber güvenliğini tek yerden, sade bir şekilde gösterir. Kısa bir tur yapalım.',
  },
  {
    target: 'kart-durum',
    baslik: 'Güvenlik Durumunuz',
    metin: 'Buradaki renk sizin güvenlik durumunuzdur: yeşilse güvendesiniz, sarı ise dikkat edilmesi gereken bir şey vardır.',
  },
  {
    target: 'kart-belge',
    baslik: 'Belgeye Hazırlık',
    metin: 'Burada SSB Siber Hijyen belgenize ne kadar hazır olduğunuzu görürsünüz. Eksik maddeler için hazır önerilerimiz olur.',
  },
  {
    target: 'kart-yapilan',
    baslik: 'Otomatik Koruma',
    metin: 'Bir tehdit olduğunda BilSec otomatik müdahale eder; burada sizin için neler yapıldığını görürsünüz.',
  },
  {
    target: 'kart-adim',
    baslik: 'Uğraşmanıza Gerek Yok',
    metin: 'Teknik işleri BilSec arka planda yürütür. Size yalnızca tek, net bir sonraki adım kalır.',
  },
  {
    target: null,
    baslik: 'Hazırsınız!',
    metin: "Detay görmek isterseniz her kartta 'Detayları gör' var. İsterseniz üstteki anahtardan Uzman Görünümü'ne geçebilirsiniz.",
  },
]

export default function Tour({ step, onNext, onPrev, onClose }) {
  const adim = TUR_ADIMLAR[step]
  const sonMu = step === TUR_ADIMLAR.length - 1
  const ilkMi = step === 0

  return (
    <>
      {/* Karartma */}
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[1px]" />

      {/* Koçmark */}
      <div className="fixed inset-x-0 bottom-8 z-[70] flex justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-accent-500/40 bg-ink-850 p-5 shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-sm font-black text-ink-950">
                B
              </span>
              <span className="text-sm font-bold text-accent-400">{adim.baslik}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 transition hover:text-slate-200"
              aria-label="Turu kapat"
            >
              ✕
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-200">{adim.metin}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {TUR_ADIMLAR.map((_, i) => (
                <span
                  key={i}
                  className={
                    'h-1.5 rounded-full transition-all ' +
                    (i === step ? 'w-5 bg-accent-400' : 'w-1.5 bg-ink-600')
                  }
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {!ilkMi && (
                <button
                  onClick={onPrev}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-200"
                >
                  Geri
                </button>
              )}
              <button
                onClick={sonMu ? onClose : onNext}
                className="rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-semibold text-ink-950 transition hover:bg-accent-400"
              >
                {sonMu ? 'Bitir' : 'İleri'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
