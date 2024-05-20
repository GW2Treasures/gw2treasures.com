#!/usr/bin/env ts-node
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { rimraf } from 'rimraf';
import { join } from 'path';
import svgo from 'svgo';

async function build() {
  // 1. clean
  console.log('Cleaning dist directory...');
  await rimraf('dist');


  // 2. create dir
  console.log('Create dist directory...');
  await mkdir('dist');


  // 3. get icons
  console.log('Get icons...');
  const iconFiles = (await readdir('icons')).filter((file) => file.endsWith('.svg'));
  const icons: Record<string, string> = {};

  console.log('Building icons...');
  for(const file of iconFiles) {
    const componentName = file.split('.')[0];

    const input = await readFile(join('icons', file), { encoding: 'utf-8' });
    let output = svgo.optimize(input, {
      plugins: [
        'preset-default',
        'removeDimensions',
        'removeXMLNS'
      ],
    }).data;
    output = output.replace(/^<svg/, `<symbol id="${componentName}"`);
    output = output.replace(/<\/svg>/, '</symbol>');

    icons[componentName] = output;
  }

  const js = `export const icons=[${Object.keys(icons).map((name) => `'${name}'`).join(',')}]`;
  await writeFile(join('dist', 'index.js'), js);

  await writeFile(join('dist', 'sprite.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs>\n' + Object.values(icons).join('\n') + '\n</defs></svg>');


  console.log('Build types file...');
  const index = `
export type IconName = ${Object.keys(icons).map((name) => `'${name}'`).join('|')};
export type IconProp = IconName | JSX.Element;
export const icons: IconName[];
`;

  await writeFile(join('dist', 'index.d.ts'), index);
}

build();
