module.exports = {
  output: {
    crossOriginLoading: true
  },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "url": require.resolve("url/"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "util": require.resolve("util/"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http")
    },
    alias: {
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
    }
  },
  rules: {
    loader: {
      options: {
        plugins: ["@babel/plugin-proposal-class-properties"]
      }
    }
  }
};