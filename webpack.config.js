const [server, client] = require('nullstack/webpack.config')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function customClient(...args) {
  const config = client(...args)
  const rule = config.module.rules.find((rule) => rule.test.test('.css'))

  rule.use.push({
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
        },
      },
    },
  })

  if (config.mode === 'buildtest') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        logLevel: 'info',
      }),
    )
  }
  // config.module.rules.push(mdxRule);

  // config.module.rule
  // config.resolve.alias = alias;

  return config
}

module.exports = [server, customClient]
