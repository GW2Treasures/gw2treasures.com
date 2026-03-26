/* eslint-disable @next/next/no-img-element */
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { createMetadata } from '@/lib/metadata';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import logoLockupPng from './lockup-red.png';
import logoLockupSvg from './lockup-red.svg';
import logoPng from './logo.png';
import logoSvg from './logo.svg';
import og from './og.png';

export default function BrandingPage() {
  return (
    <HeroLayout hero={(<Headline id="branding">Branding Guidelines</Headline>)} toc>
      <p>This page contains the branding guidelines you should follow when referring to gw2treasures.com in your content.</p>

      <Headline id="name">Name</Headline>
      <p>The name of the website is <strong>gw2treasures.com</strong>. It should always be written in lowercase and with the full domain, including the .com. The name should not be shortened to &quot;gw2treasures&quot; or &quot;gw2t&quot;.</p>

      <Headline id="logo">Logo</Headline>

      <div style={{ marginBottom: 32 }}>
        <img src={logoSvg.src} alt="gw2treasures.com logo" height={128} style={{ borderRadius: 8 }}/>

        <FlexRow>
          <LinkButton href={logoSvg.src} download="gw2treasures-logo.svg" icon="download" iconColor="#b7000d" appearance="menu">
            Download (svg)
          </LinkButton>
          <LinkButton href={logoPng.src} download="gw2treasures-logo.png" icon="download" iconColor="#b7000d" appearance="menu">
            Download (png)
          </LinkButton>
        </FlexRow>
      </div>

      <div style={{ marginBottom: 32 }}>
        <img src={logoLockupSvg.src} alt="gw2treasures.com lockup" height={64} style={{ borderRadius: 8 }}/>

        <FlexRow>
          <LinkButton href={logoLockupSvg.src} download="gw2treasures-lockup.svg" icon="download" iconColor="#b7000d" appearance="menu">
            Download (svg)
          </LinkButton>
          <LinkButton href={logoLockupPng.src} download="gw2treasures-lockup.png" icon="download" iconColor="#b7000d" appearance="menu">
            Download (png)
          </LinkButton>
        </FlexRow>
      </div>

      <p>
        The logo should always be used in its original form and should not be modified in any way.
        If used with a transparent background, it should be placed on a solid color that provides sufficient contrast.
        The logo should not be used in a way that implies endorsement or sponsorship by gw2treasures.com without prior written permission.
      </p>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Branding Guidelines',
  description: 'Guidelines and logos for referring to gw2treasures.com in your content.',
  image: og
});
