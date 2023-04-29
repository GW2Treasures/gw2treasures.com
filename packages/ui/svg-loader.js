function withSvgIcons(config) {
  config.module.rules.push({
    test: /\.svg$/i,
    resourceQuery: /svgr/,
    use: [{ loader: '@svgr/webpack', options: { ref: true }}],
  });
}

module.exports = withSvgIcons;
