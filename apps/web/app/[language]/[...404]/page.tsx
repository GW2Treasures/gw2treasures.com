import { notFound } from 'next/navigation';

export default function NotFoundCatchAll(params: any) {
  notFound();
}

export const metadata = {
  title: '404'
};
