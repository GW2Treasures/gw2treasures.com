import { copyFileSync, mkdirSync } from 'node:fs';

// get path to onig.wasm
const onigPath = new URL('onig.wasm', import.meta.resolve('vscode-oniguruma', import.meta.url));

// create `dist` directory and copy onig.wasm
mkdirSync('./dist', { recursive: true });
copyFileSync(onigPath, './dist/onig.wasm');

console.log('Created dist/onig.wasm');
