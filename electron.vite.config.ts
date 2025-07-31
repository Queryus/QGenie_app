import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Plugin } from 'vite'

// Vite plugin for mocking the AI chat API
const mockApiPlugin = (): Plugin => ({
  name: 'mock-api-plugin',
  configureServer(server) {
    server.middlewares.use('/api/chat', (req, res) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        let lastMessage = ''
        try {
          if (body) {
            const parsedBody = JSON.parse(body)
            const messages = parsedBody.messages || []
            lastMessage = messages[messages.length - 1]?.content || ''
          }
        } catch (error) {
          console.error('Error parsing request body in mock API:', error)
        }

        // Set headers for data stream
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'x-vercel-ai-data-stream': 'v1'
        })

        const mockSql =
          '```sql\nSELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, \
          SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN \
          SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, \
          p.ProductName ORDER BY total_revenue DESC LIMIT 5;\n```'
        const mockResponseContent = `${lastMessage}: 조회하는 쿼리를 생성했습니다.\n\n${mockSql}\n\n`

        let index = 0
        const streamInterval = setInterval(() => {
          if (index < mockResponseContent.length) {
            const char = mockResponseContent[index]
            res.write(`${char}`)
            index++
          } else {
            clearInterval(streamInterval)
            res.end()
          }
        }, 20) // Stream one character every 50ms
      })
    })
  }
})

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ['@electron-toolkit/preload'] })],
    build: {
      lib: {
        entry: 'src/preload/index.ts',
        formats: ['cjs'],
        fileName: 'index.js'
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@/components': resolve('src/renderer/src/components'),
        '@/lib/utils': resolve('src/renderer/src/lib/utils')
      }
    },
    plugins: [react(), tailwindcss(), mockApiPlugin()]
  }
})
