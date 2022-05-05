module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  images: {
    domains: ['alunotv-dev.s3.amazonaws.com']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              'frame-ancestors *.layers.education localhost *.layers.digital'
          },
          {
            key: 'X-Content-Security-Policy',
            value:
              'frame-ancestors *.layers.education localhost *.layers.digital'
          }
        ]
      }
    ]
  }
}
