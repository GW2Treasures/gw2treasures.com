#!/usr/bin/env ts-node

import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { rimraf } from 'rimraf';
import { transform, Config } from '@svgr/core';
import { join } from 'path';

const svgrConfig: Config = {
  ref: true,
  plugins: ['@svgr/plugin-jsx'],
  jsx: {
    babelConfig: {
      plugins: [
        ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
      ]
    }
  },
  template: (variables, { tpl }) => {
    return tpl`(${variables.props}) => (${variables.jsx})`;
  }
};

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

    const content = await readFile(join('icons', file), { encoding: 'utf-8' });

    const jsCode = await transform(content, svgrConfig, { componentName, filePath: file });

    icons[componentName] = jsCode.replace(`var _reactJsxRuntime = require("react/jsx-runtime");
`, '').replace(/;$/, '');

    //await writeFile(join('dist', componentName + '.jsx'), jsCode);
  }

  const output = `import React from 'react';
import _reactJsxRuntime from 'react/jsx-runtime';

export const icons = {\n${Object.entries(icons)
  .map(([key, value]) => `  '${key}': React.forwardRef(${value})`)
  .join(',\n')
}\n};`

  writeFile(join('dist', 'index.js'), output);

  console.log('Build types file...');
  const index = `
export type IconName = ${iconFiles.map((name) => `'${name.split('.')[0]}'`).join('|')};
export type IconProp = IconName | JSX.Element;
export const icons: Record<IconName, FunctionComponent<SVGProps<SVGSVGElement>>>;
`;

  await writeFile(join('dist', 'index.d.ts'), index);

}

build();
