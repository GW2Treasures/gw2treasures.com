import { Trans as TransComponent } from './Trans.types';

export const Trans: typeof TransComponent = ({ id }) => {
  console.log('Trans server');

  return (
    <span>[Server Translation: {id}]</span>
  );
};
