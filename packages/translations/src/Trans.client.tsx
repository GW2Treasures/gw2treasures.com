import { Trans as TransComponent } from './Trans.types';

export const Trans: typeof TransComponent = ({ id }) => {
  console.log('Trans client');

  return (
    <span>[Client Translation: {id}]</span>
  );
};
