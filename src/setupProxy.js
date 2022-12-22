const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    createProxyMiddleware('/productURL', {
      target: 'https://dev-be.admin.gear5.guru',
      // target: process.env.REACT_APP_BACK_END_URL,
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
      // target: process.env.REACT_APP_BACK_END_SEARCH,
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
      // target: process.env.REACT_APP_BACK_END_MONITOR,
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
