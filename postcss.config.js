// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./public/**/*.html', './src/**/*.vue'],
  extractors: [
    {
      extractor: (content) => content.match(/[A-z0-9-:\/]+/g) || [],
      extensions: ['vue'],
    },
  ],
});

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
