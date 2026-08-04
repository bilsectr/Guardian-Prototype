import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BilSec Brain — hafif sunucu tarafı proxy.
// API anahtarı yalnızca dev sunucusunda kalır, tarayıcıya sızmaz.
// Anahtar yoksa 501 döner ve istemci önceden gömülü fallback çıktıyı gösterir.
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
            const apiKey = env.ANTHROPIC_API_KEY
            if (!apiKey) return send(501, { error: 'no_api_key' })

            const model = env.CLAUDE_MODEL || 'claude-sonnet-5'
            const r = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
              },
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
            return send(200, { text, model })
          } catch (e) {
            return send(500, { error: 'server_error', detail: String(e) })
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix → VITE_ öneki olmayan değişkenleri de yükler (ANTHROPIC_API_KEY).
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), bilsecBrainProxy(env)],
    server: { port: 5173 },
  }
})
