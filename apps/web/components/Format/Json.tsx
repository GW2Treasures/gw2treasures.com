/* eslint-disable @next/next/no-img-element */
import type { FC } from 'react';
import { Code } from '../Layout/Code';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';

export interface JsonProps {
  data: object;
  borderless?: boolean;
}

const comma = <span style={{ color: '#aaa' }}>, </span>;

function renderJson([key, value]: [string, any], index: number, array: any[]) {
  return (
    <div key={key} style={{ marginLeft: 16 }}>&quot;{key}&quot;: {renderValue(value, index, array)}</div>
  );
}

function renderValue(value: any, index: number, array: any[]) {
  const maybeComma = index < array.length - 1 && comma;

  switch(typeof value) {
    case 'string':
      return (
        <span key={index} style={{ color: '#009688' }}>
          &quot;{value.startsWith('https://render.guildwars2.com/')
            ? <Tip tip={<img src={value} alt="Preview"/>}><a href={value} style={{ color: '#009688' }}>{value}</a></Tip>
            : value.replaceAll('"', '\\"')
          }&quot;{maybeComma}
        </span>
      );
    case 'number':
    case 'boolean':
      return <span key={index} style={{ color: '#e91e63' }}>{value.toString()}{maybeComma}</span>;
    case 'object':
      if(value === null) {
        return <span key={index} style={{ color: '#e91e63' }}>null{maybeComma}</span>;
      }
      return Array.isArray(value)
        ? <span key={index}>[{value.length > 0 && (<div style={{ marginLeft: 16 }}>{value.map(renderValue)}</div>)}]{maybeComma}</span>
        : <span key={index}>{'{'}{Object.entries(value).map(renderJson)}{'}'}{maybeComma}</span>;
  }

  return typeof value;
}

export const Json: FC<JsonProps> = ({ data, borderless = false }) => {
  return (
    <Code borderless={borderless}>
      {'{'}
      {Object.entries(data).map(renderJson)}
      {'}'}
    </Code>
  );
};
