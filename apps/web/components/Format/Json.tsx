import { FC } from 'react';
import { Code } from '../Layout/Code';

export interface JsonProps {
  data: object
}

const comma = <span style={{ color: '#aaa' }}>, </span>;

function renderJson([key, value]: [string, any], index: number, array: any[]) {
  return (
    <div key={key} style={{ marginLeft: 16 }}>&quot;{key}&quot;: {renderValue(value, index, array)}</div>
  );
}

function renderValue(value: any, index: number, array: any[]) {
  switch(typeof value) {
    case 'string': return <span key={index} style={{ color: '#009688' }}>&quot;{value.startsWith('https://render.guildwars2.com/') ? <a href={value} style={{ color: '#009688' }}>{value}</a> : value.replaceAll('"', '\\"')}&quot;{index < array.length - 1 && comma}</span>;
    case 'number': return <span key={index} style={{ color: '#e91e63' }}>{value}{index < array.length - 1 && comma}</span>;
    case 'object': return Array.isArray(value) ? <span key={index}>[{value.length > 0 && (<div style={{ marginLeft: 16 }}>{value.map(renderValue)}</div>)}]{index < array.length - 1 && comma}</span> : <span key={index}>{'{'}{Object.entries(value).map(renderJson)}{'}'}{index < array.length - 1 && comma}</span>;
  }

  return typeof value;
}

export const Json: FC<JsonProps> = ({ data }) => {
  return (
    <Code>
      {'{'}
      {Object.entries(data).map(renderJson)}
      {'}'}
    </Code>
  );
};
