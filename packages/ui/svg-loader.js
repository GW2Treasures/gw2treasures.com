function withSvgIcons(config) {
  config.module.rules.push({
    test: /\.svg$/i,
    use: [{ loader: '@svgr/webpack', options: { ref: true }}],
  });
}

module.exports = withSvgIcons;
