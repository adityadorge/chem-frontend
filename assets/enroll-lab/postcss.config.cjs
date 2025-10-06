module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-prefix-selector')({
      prefix: '#enroll-lab', // scope all selectors to this container
      transform(prefix, selector, prefixed) {
        if (selector.startsWith('html') || selector.startsWith('body')) return prefix;
        return prefixed;
      }
    })
  ]
}