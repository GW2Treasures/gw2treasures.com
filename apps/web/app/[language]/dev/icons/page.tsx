/* eslint-disable @next/next/no-img-element */
import { Code } from '@/components/Layout/Code';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Highlight } from '@/components/Layout/Highlight';
import { List } from '@gw2treasures/ui/components/Layout/List';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';

const htmlExample = `<img
  src="https://icons-gw2.darthmaim-cdn.com/9D94B96446F269662F6ACC2531394A06C0E03951/947657-32px.png"
  srcset="https://icons-gw2.darthmaim-cdn.com/9D94B96446F269662F6ACC2531394A06C0E03951/947657-64px.png 2x"
  width="32" height="32" alt="" crossorigin="anonymous" referrerpolicy="no-referrer" loading="lazy" decoding="async"/>`;

export default function DeveloperIconsPage() {
  return (
    <HeroLayout hero={<Headline id="icons">Icons</Headline>} color="#2c8566" toc>
      <p>gw2treasures.com provides an alternative icon service of the default render.guildwars2.com with more features.</p>

      <Headline id="features">Features</Headline>
      <p>The icons served by ArenaNets render service are not optimized. By lossless compression and discarding metadata from the images, the filesize can be reduced by over 20% on average. If you have multiple icons on a page, saving 20% of transmitted bytes means a noticeable speed improvement.</p>
      <p>Often you don&apos;t want to display a 64x64 version of the icon on your page, but by loading the big icon and downscaling it clientside you are wasting bandwith. We provide all icons in 64x64, 32x32 and 16x16, so you can pick the dimensions and are only downloading the bytes you need.</p>

      <Headline id="useage">Useage</Headline>
      <p>gw2treasures.com provides thumbnails and compressed versions of all icons from ArenaNets render service. This is ideal if you use many icons or icons with smaller dimension than the default 64px. The dimensions available are 16px, 32px and 64px.</p>

      <p>The icons are available at this url:</p>
      <Code>https://icons-gw2.darthmaim-cdn.com/<strong>{'{'}signature{'}'}</strong>/<strong>{'{'}file_id{'}'}</strong>-<strong>{'{'}size{'}'}</strong>.png</Code>

      <Table>
        <thead><tr><th>Parameter</th><th>Description</th></tr></thead>
        <tbody>
          <tr>
            <th><Code inline>signature</Code></th>
            <td>The <Code inline>file_signature</Code> you get from the official API.</td>
          </tr>
          <tr>
            <th><Code inline>file_id</Code></th>
            <td>The <Code inline>file_id</Code> you get from the official API.</td>
          </tr>
          <tr>
            <th><Code inline>size</Code></th>
            <td>
              Valid sizes are:
              <List>
                <li>64px</li>
                <li>32px</li>
                <li>16px</li>
              </List>
            </td>
          </tr>
        </tbody>
      </Table>

      <p>
        To load higher resolution icons for devices with higher dpi-screens, you can use the <Code inline>srcset</Code> attribute.
        Devices with lower resolutions, will still load the smaller file and save bandwith.
        You can read more about the <Code inline>srcset</Code> attribute on the <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset">MDN page about the <Code inline>img</Code> element</ExternalLink>.
      </p>

      <Headline id="code">Code</Headline>
      <p>Here is a complete optimized example code to load an icon:</p>
      <Code>
        <Highlight language="html" code={htmlExample}/>
      </Code>

      <Headline id="examples">Examples</Headline>

      <Table>
        <thead><tr><th>Icon</th><th>URL</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <img src="https://icons-gw2.darthmaim-cdn.com/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png" width="64" height="64" alt=""/>
            </td>
            <td>
              <Code inline>https://icons-gw2.darthmaim-cdn.com/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png</Code>
            </td>
          </tr>
          <tr>
            <td>
              <img src="https://icons-gw2.darthmaim-cdn.com/4F19A8B4E309C3042358FB194F7190331DEF27EB/631494-32px.png" width="32" height="32" alt=""/>
            </td>
            <td>
              <Code inline>https://icons-gw2.darthmaim-cdn.com/4F19A8B4E309C3042358FB194F7190331DEF27EB/631494-32px.png</Code>
            </td>
          </tr>
          <tr>
            <td>
              <img src="https://icons-gw2.darthmaim-cdn.com/027D1D382447933D074BE45F405EA1F379471DEB/63127-16px.png" width="16" height="16" alt=""/>
            </td>
            <td>
              <Code inline>https://icons-gw2.darthmaim-cdn.com/027D1D382447933D074BE45F405EA1F379471DEB/63127-16px.png</Code>
            </td>
          </tr>
        </tbody>
      </Table>

    </HeroLayout>
  );
}

export const metadata = {
  title: 'Icon Service'
};
