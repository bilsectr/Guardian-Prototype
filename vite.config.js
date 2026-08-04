import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BilSec Brain — hafif sunucu tarafı proxy.
// Yapay zekâ yapılandırması yalnızca dev sunucusunda kalır, tarayıcıya sızmaz.
// Yapılandırma yoksa 501 döner ve istemci önceden gömülü fallback çıktıyı gösterir.
function bilsecBrainProxy(env) {
  return {
    name: 'bilsec-brain-proxy',
    configureServer(server) {
      server.middlewares.use('/api/brain', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          const send = (code, obj) => {
            res.statusCode = code
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(obj))
          }
          try {
            const { system, prompt, max_tokens } = JSON.parse(body || '{}')
            // Yapay zekâ yapılandırması yalnızca yerel .env dosyasında tutulur.
            const apiKey = env.AI_API_KEY
            const apiUrl = env.AI_API_URL
            const model = env.AI_MODEL
            if (!apiKey || !apiUrl || !model) return send(501, { error: 'ai_not_configured' })

            const headers = {
              'content-type': 'application/json',
              'x-api-key': apiKey,
            }
            // Bazı sağlayıcılar bir sürüm başlığı ister (ad + değer .env'den).
            if (env.AI_API_VERSION_HEADER && env.AI_API_VERSION) {
              headers[env.AI_API_VERSION_HEADER] = env.AI_API_VERSION
            }

            const r = await fetch(apiUrl, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                model,
                max_tokens: max_tokens || 1200,
                system,
                messages: [{ role: 'user', content: prompt }],
              }),
            })
            const data = await r.json()
            if (!r.ok) return send(502, { error: 'api_error', detail: data })
            const text = (data.content || []).map((b) => b.text || '').join('')
            // Ham model kimliği yerine nötr bir etiket döndür.
            return send(200, { text, model: 'BilSec Brain' })
          } catch (e) {
            return send(500, { error: 'server_error', detail: String(e) })
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix → VITE_ öneki olmayan değişkenleri de yükler (AI_API_KEY vb.).
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: '/Guardian-Prototype/',
    plugins: [react(), tailwindcss(), bilsecBrainProxy(env)],
    server: { port: 5173 },
  }
})
