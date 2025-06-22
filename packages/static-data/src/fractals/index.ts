import dailyData from './data/dailies.json';
import fractalData from './data/fractals.json';
import instabilityData from './data/instabilities.json';
import recommendedData from './data/recommended.json';

export const { dailies } = dailyData;
export const { scales, fractal_details } = fractalData;
export const { instabilities, instability_details } = instabilityData;
export const { recommended } = recommendedData;


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

  return instabilities[level.toString() as keyof typeof instabilities][dayOfYearIndex].slice(0, tier);
}
