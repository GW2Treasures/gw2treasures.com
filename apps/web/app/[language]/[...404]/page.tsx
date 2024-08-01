import { notFound } from 'next/navigation';

export default function NotFoundCatchAll() {
  notFound();
}

export { metadata } from '../not-found';
