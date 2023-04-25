import { Headline } from '@/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ExternalLink } from '@/components/Link/ExternalLink';
import { TableOfContentAnchor } from '@/components/TableOfContent/TableOfContent';

export default function AboutPage() {
  return (
    <HeroLayout hero={<Headline id="about">About</Headline>} toc>
      <TableOfContentAnchor id="about">About</TableOfContentAnchor>
      <p><b>gw2treasures.com</b> is a database website for Guild Wars 2. Development started in November 2013, shortly after the official API for the game released. It was completly rewritten starting in 2021 using modern technology.</p>

      <Headline id="tech">Technology</Headline>
      <p>Everything is written in <ExternalLink href="https://www.typescriptlang.org/">TypeScript</ExternalLink>. The website is using <ExternalLink href="https://react.dev/">react</ExternalLink> and the latest <ExternalLink href="https://nextjs.org/">next.js</ExternalLink> with appDir enabled. The database is <ExternalLink href="https://www.postgresql.org/">PostgreSQL</ExternalLink> and <ExternalLink href="https://www.prisma.io/">prisma</ExternalLink> is used to access it.</p>

      <Headline id="github">Open Source</Headline>
      <p>Do you want to contribute to the development of gw2treasures.com? You can! Everything is open-source on github: <ExternalLink href="https://github.com/gw2treasures/gw2treasures.com/tree/next">gw2treasures/gw2treasures.com</ExternalLink>.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'About'
};
