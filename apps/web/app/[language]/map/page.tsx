import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { preconnect } from 'react-dom';

const MapComponent = dynamic(() => import('./map').then((module) => ({ 'default': module.Map })), { ssr: false });

export default function MapPage() {
  preconnect('https://tiles1.gw2.io/', { crossOrigin: 'anonymous' });

  return <Suspense fallback="Loading"><MapComponent/></Suspense>;
}

export const metadata: Metadata = {
  title: 'Map',
  description: 'Interactive Map of Tyria',
};
