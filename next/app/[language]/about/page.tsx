import { Headline } from '@/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { TableOfContentAnchor } from '@/components/TableOfContent/TableOfContent';
import { Bitter } from 'next/font/google';

export default function AboutPage() {
  return (
    <HeroLayout hero={<Headline id="about">About</Headline>} toc>
      <TableOfContentAnchor id="about">About</TableOfContentAnchor>
      <p><b>gw2treasures.com</b> is a database website for Guild Wars 2. Development started in November 2013, shortly after the official API for the game released. It was completly rewritten starting in 2021 using modern technology.</p>

      <Headline id="tech">Technology</Headline>
      <p>Everything is written in <a href="https://www.typescriptlang.org/">TypeScript</a>. The website is using <a href="https://react.dev/">react</a> and the latest <a href="https://nextjs.org/">next.js</a> with appDir enabled. The database is <a href="https://www.postgresql.org/">PostgreSQL</a> and <a href="https://www.prisma.io/">prisma</a> is used to access it.</p>

      <Headline id="github">Open Source</Headline>
      <p>Do you want to contribute to the development of gw2treasures.com? You can! Everything is open-source on github: <a href="https://github.com/gw2treasures/gw2treasures.com/tree/next">gw2treasures/gw2treasures.com</a>.</p>
    </HeroLayout>
  );
}
