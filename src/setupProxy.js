const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    createProxyMiddleware('/productURL', {
      target: 'https://admin-poker0.gear5.guru',
      changeOrigin: true,
      pathRewrite: {
        '^/productURL': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/searchURL', {
      target: 'https://search-poker0.gear5.guru',
      changeOrigin: true,
      pathRewrite: {
        '^/searchURL': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
  app.use(
    createProxyMiddleware('/monitorURL', {
      target: 'https://alter-poker0.gear5.guru',
      changeOrigin: true,
      pathRewrite: {
        '^/monitorURL': ''
      },
      headers: {
        Connection: 'keep-alive'
      }
    })
  )
}
