import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { Code } from '@/components/Layout/Code';

export default function AboutPage() {
  return (
    <HeroLayout hero={<Headline id="about">About</Headline>} toc>
      <TableOfContentAnchor id="about">About</TableOfContentAnchor>
      <p><b>gw2treasures.com</b> is a database website for Guild Wars 2. Development started in November 2013, shortly after the official API for the game released, and was released on January 10, 2014. It was completly rewritten starting in 2021 using modern technology.</p>

      <Headline id="tech">Technology</Headline>
      <p>Everything is written in <ExternalLink href="https://www.typescriptlang.org/">TypeScript</ExternalLink>. The website is using <ExternalLink href="https://react.dev/">react</ExternalLink> and the latest <ExternalLink href="https://nextjs.org/">next.js</ExternalLink> (App Router). The database is <ExternalLink href="https://www.postgresql.org/">PostgreSQL</ExternalLink> and <ExternalLink href="https://www.prisma.io/">prisma</ExternalLink> is used to access it.</p>

      <Headline id="github">Open Source</Headline>
      <p>Do you want to contribute to the development of gw2treasures.com? You can! Everything is open-source on GitHub: <ExternalLink href="https://github.com/GW2Treasures/gw2treasures.com">gw2treasures/gw2treasures.com</ExternalLink>.</p>

      <Headline id="contact">Contact</Headline>
      <p>Join the discord <ExternalLink href="https://discord.gg/gvx6ZSE" target="_blank">Discord</ExternalLink> (channel <Code inline>#gw2treasures</Code>) or send an email to <a href="mailto:support@gw2treasures.com">support@gw2treasures.com</a>.</p>
      <p>Feature Requests and Bug Reports can also be submitted <ExternalLink href="https://github.com/GW2Treasures/gw2treasures.com/issues">on GitHub</ExternalLink>.</p>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'About'
};
