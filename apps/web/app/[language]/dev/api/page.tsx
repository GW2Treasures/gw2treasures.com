import { Code } from '@/components/Layout/Code';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import Link from 'next/link';

const exampleCodeFetchWithAuthorizationHeader = `// example javascript fetch

fetch('https://api.gw2treasures.com/items', {
  headers: {
    Authorization: \`Bearer \${apiKey}\`
  }
})`;

export default function DeveloperIconsPage() {
  return (
    <HeroLayout hero={<Headline id="api">API</Headline>} color="#2c8566" toc>
      <p>gw2treasures.com provides a public API. The API contains data not available in the official Guild Wars 2 API, for example deleted or community contributed content.</p>

      <Headline id="authorization">API Key</Headline>
      <p>All requests to the gw2treasures.com API require an API key. This API key is used for per application rate limiting and versioning. Some endpoints may require approval before an application can use them in the future.</p>

      <p>You can <Link href="/dev/app/create">create</Link> as many applications as you want. After creating a new application you can access its API key. You can view all your applications on the <Link href="/dev#applications">Developer page</Link>.</p>

      <p>The API key can be passed as header (<Code inline>Authorization: Bearer &lt;api-key&gt;</Code>) or as <Code inline>apiKey</Code> query paramer.</p>

      <Code>{exampleCodeFetchWithAuthorizationHeader}</Code>

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
            <th><Code inline>/items</Code></th>
            <td>Get a list of all item ids</td>
          </tr>
        </tbody>
      </Table>
    </HeroLayout>
  );
};
