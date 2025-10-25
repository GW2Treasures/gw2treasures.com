import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { Code } from '@/components/Layout/Code';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { createMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/url';

export default function AboutPage() {
  return (
    <HeroLayout hero={<Headline id="about">About</Headline>} toc>
      <TableOfContentAnchor id="about">About</TableOfContentAnchor>
      <p><b>gw2treasures.com</b> is a database website for Guild Wars 2. Development started in November 2013, shortly after the official API for the game released, and was released on January 10, 2014. It was completly rewritten starting in 2021 using modern technology.</p>

      <Headline id="partner">ArenaNet Partner</Headline>
      <p>
        gw2treasures.com is an <b>ArenaNet Partner</b>. You can support this website by buying Guild Wars 2 using our <ExternalLink href={new URL('/buy-gw2', getBaseUrl()).toString()}>affiliate link</ExternalLink>.
        If you want to try Guild Wars 2 for free, you can use <ExternalLink href={new URL('/try-gw2', getBaseUrl()).toString()}>this link instead</ExternalLink>.
      </p>
      <p style={{ color: 'var(--color-text-muted)', marginTop: -16, fontSize: 15 }}>
        The affiliate link works by setting a cookie in your browser, you don&apos;t need to enter a code. Please disable your adblocker to make sure the cookie is working correctly.
      </p>

      <Headline id="tech">Technology</Headline>
      <p>Everything is written in <ExternalLink href="https://www.typescriptlang.org/">TypeScript</ExternalLink>. The website is using <ExternalLink href="https://react.dev/">react</ExternalLink> and the latest <ExternalLink href="https://nextjs.org/">next.js</ExternalLink> (App Router). The database is <ExternalLink href="https://www.postgresql.org/">PostgreSQL</ExternalLink> and <ExternalLink href="https://www.prisma.io/">prisma</ExternalLink> is used to access it.</p>

      <Headline id="hosting">Hosting</Headline>
      <p>gw2treasures.com is hosted in a kubernetes cluster on Hetzner Cloud. Use this referral link to sign up to Hetzner Cloud and receive $20 credits while supporting the hosting of this website: <ExternalLink href="https://hetzner.cloud/?ref=dy6iiRdH7bxg">Hetzner Cloud (Referral)</ExternalLink>.</p>

      <Headline id="github">Open Source</Headline>
      <p>Do you want to contribute to the development of gw2treasures.com? You can! Everything is open-source on GitHub: <ExternalLink href="https://github.com/GW2Treasures/gw2treasures.com">gw2treasures/gw2treasures.com</ExternalLink>.</p>

      <Headline id="donate">Donate</Headline>
      <p>If you want to support the development and hosting of gw2treasures.com by donating, you can do so on <ExternalLink href="https://ko-fi.com/darthmaim">Ko-fi</ExternalLink>.</p>

      <Headline id="contact">Contact</Headline>
      <p>Join the discord <ExternalLink href="https://discord.gg/gvx6ZSE" target="_blank">Discord</ExternalLink> (channel <Code inline>#gw2treasures</Code>) or send an email to <a href="mailto:support@gw2treasures.com">support@gw2treasures.com</a>.</p>
      <p>Feature Requests and Bug Reports can also be submitted <ExternalLink href="https://github.com/GW2Treasures/gw2treasures.com/issues">on GitHub</ExternalLink>.</p>

      <Headline id="data">Additional Data</Headline>
      <p>In addition to the official Guild Wars 2 API some data is used from external sources:</p>
      <Table width="auto">
        <thead><tr><th>Data</th><th>Source</th></tr></thead>
        <tbody>
          <tr><th>Additional Item and Skin data</th><th><ExternalLink href="https://wiki.guildwars2.com/wiki/Main_Page">Guild Wars 2 Wiki</ExternalLink></th></tr>
          <tr><th>Unlock statistics</th><th><ExternalLink href="https://gw2efficiency.com">gw2efficiency.com</ExternalLink></th></tr>
          <tr><th>Additional data</th><th><ExternalLink href="https://github.com/gw2efficiency/game-data">github.com/gw2efficiency/game-data</ExternalLink></th></tr>
          <tr><th>Fractal instabilities</th><th><ExternalLink href="https://github.com/Invisi/gw2-fotm-instabilities">github.com/Invisi/gw2-fotm-instabilities</ExternalLink></th></tr>
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'About'
});
