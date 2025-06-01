import instabilityData from './instabilities/data.json';

export function getDayOfYearIndex(date: Date = new Date()) {
  const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfYearUTC = Date.UTC(date.getFullYear(), 0, 1);

  const index = (dateUTC - startOfYearUTC) / 24 / 60 / 60 / 1000;

  const isLeapYear = new Date(date.getUTCFullYear(), 1, 29).getDate() === 29;

  return !isLeapYear && index >= 59
    ? index + 1
    : index;
}

export function getInstabilities(level: number, dayOfYearIndex: number) {
  const tier = Math.floor((level - 1) / 25);

  if(tier !== 3) {
    return [];
  }

  // const t4Level = level + (3 - tier) * 25;

  return instabilityData.instabilities[level.toString() as keyof typeof instabilityData.instabilities][dayOfYearIndex].slice(0, tier);
}

import data from './fractals.json';
export { data };
