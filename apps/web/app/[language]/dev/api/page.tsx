import { Code } from '@/components/Layout/Code';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Highlight } from '@/components/Layout/Highlight';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { getCurrentUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import Link from 'next/link';

const exampleCodeFetchWithAuthorizationHeader =
`fetch('https://api.gw2treasures.com/items', {
  headers: {
    Authorization: \`Bearer \${apiKey}\`
  }
})`;

export default function DeveloperIconsPage() {
  const apiUrl = getCurrentUrl();
  apiUrl.hostname = `api.${process.env.GW2T_NEXT_DOMAIN}`;
  apiUrl.pathname = '/';

  return (
    <HeroLayout hero={<Headline id="api">API</Headline>} color="#2c8566" toc>
      <p>gw2treasures.com provides a public API. The API contains data not available in the official Guild Wars 2 API, for example deleted or community contributed content.</p>
      <p>The API is available at <ExternalLink target="_blank" href={apiUrl.toString()}><Code inline>{apiUrl.toString()}</Code></ExternalLink>.</p>

      <Headline id="authorization">API Key</Headline>
      <p>All requests to the gw2treasures.com API require an API key. This API key is used for per application rate limiting and versioning. Some endpoints may require approval before an application can use them in the future.</p>

      <p>You can <Link href="/dev/app/create">create</Link> as many applications as you want. After creating a new application you can access its API key. You can view all your applications on the <Link href="/dev#applications">Developer page</Link>.</p>

      <p>The API key can be passed as header (<Code inline>Authorization: Bearer &lt;api-key&gt;</Code>) or as <Code inline>apiKey</Code> query parameter.</p>

      <Code><Highlight language="javascript" code={exampleCodeFetchWithAuthorizationHeader}/></Code>

      <Headline id="endpoints">Endpoints</Headline>

      <Table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><Link href="#/achievements"><Code inline>/achievements</Code></Link></th>
            <td>Get a list of all achievement IDs</td>
          </tr>
          <tr>
            <th><Link href="#/achievements/:id/data"><Code inline>/achievements/:id/data</Code></Link></th>
            <td>Get data of an achievement (same format as returned by the official Guild Wars 2 API)</td>
          </tr>
          <tr>
            <th><Link href="#/items"><Code inline>/items</Code></Link></th>
            <td>Get a list of all item IDs</td>
          </tr>
          <tr>
            <th><Link href="#/items/:id/data"><Code inline>/items/:id/data</Code></Link></th>
            <td>Get data of an item (same format as returned by the official Guild Wars 2 API)</td>
          </tr>
        </tbody>
      </Table>

      <Headline id="/achievements">GET <Code inline>/achievements</Code></Headline>
      <p>Get a list of all achievement IDs.</p>

      <Headline id="/achievements/:id/data">GET <Code inline>/achievements/:id/data</Code></Headline>
      <p>Get data of an achievement (same format as returned by the official Guild Wars 2 API).</p>
      <p>The HTTP response will contain a <Code inline>X-Created-At</Code> header with an ISO 8601 timestamp of when the achievement was first discovered.</p>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Parameter</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><Code inline>lang</Code></th>
            <td>The language of the achievement (<Code inline>de</Code> / <Code inline>en</Code> / <Code inline>es</Code> / <Code inline>fr</Code>)</td>
          </tr>
        </tbody>
      </Table>

      <Headline id="/items">GET <Code inline>/items</Code></Headline>
      <p>Get a list of all item IDs.</p>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Parameter</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><Code inline>type</Code></th>
            <td>Filter the item <Code inline>type</Code>. Examples: Weapon, Armor, …</td>
          </tr>
          <tr>
            <th><Code inline>subtype</Code></th>
            <td>Filter the item subtype (provided in <Code inline>details.type</Code>). Examples: Axe, Coat, …</td>
          </tr>
          <tr>
            <th><Code inline>rarity</Code></th>
            <td>Filter the item <Code inline>rarity</Code>. Examples: Exotic, Ascended, …</td>
          </tr>
          <tr>
            <th><Code inline>weight</Code></th>
            <td>Filter the item weight. Only returns items with type Armor. Examples: Light, Medium, Heavy</td>
          </tr>
        </tbody>
      </Table>

      <Headline id="/items/:id/data">GET <Code inline>/items/:id/data</Code></Headline>
      <p>Get data of an item (same format as returned by the official Guild Wars 2 API).</p>
      <p>The HTTP response will contain a <Code inline>X-Created-At</Code> header with an ISO 8601 timestamp of when the item was first discovered.</p>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Parameter</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><Code inline>lang</Code></th>
            <td>The language of the item (<Code inline>de</Code> / <Code inline>en</Code> / <Code inline>es</Code> / <Code inline>fr</Code>)</td>
          </tr>
        </tbody>
      </Table>

      <Headline id="/items/:id/mystic-forge">GET <Code inline>/items/:id/mystic-forge</Code></Headline>
      <p>Returns all the mystic forge recipes that can be used to craft the item.</p>

    </HeroLayout>
  );
};

export const metadata = {
  title: 'API'
};
