// import URL with different name, because Next.js/webpack override the global URL
const { URL: NodeUrl } = require('node:url');

// create url to local onig.wasm
export const url = new NodeUrl('./dist/onig.wasm', import.meta.url);
