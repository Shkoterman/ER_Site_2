module.exports = {
  // Другие настройки Webpack
  resolve: {
    fallback: {
      "path": false,
      "os": false,
      "crypto": false
    }
  }
};