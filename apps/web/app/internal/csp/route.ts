import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(getStaticHashes());
}

function getStaticHashes(): { routeRegex: string, scripts: string[] }[] {
  if(process.env.NODE_ENV !== 'production') {
    return [];
  }

  try {
    // import next manifests
    const prerenderManifest = JSON.parse(readFileSync('./.next/prerender-manifest.json').toString()) as { dynamicRoutes: Record<string, { routeRegex: string }> };
    const routeManifest = JSON.parse(readFileSync('./.next/app-path-routes-manifest.json').toString()) as Record<string, string>;
    const appBuildManifest = JSON.parse(readFileSync('./.next/app-build-manifest.json').toString()) as { pages: Record<string, string[]> };
    const sriManifest = JSON.parse(readFileSync('./.next/server/subresource-integrity-manifest.json').toString()) as Record<string, string>;

    return Object.entries(prerenderManifest.dynamicRoutes).map(([staticPath, { routeRegex }]) => {
      // lookup path in routes manifest
      const staticRoute = Object.entries(routeManifest).find(([, path]) => path === staticPath)?.[0];

      // lookup resources used by the static route
      const staticResources = staticRoute ? appBuildManifest.pages[staticRoute] : [];
      const scriptFiles = staticResources.filter((filename) => filename.endsWith('.js'));

      // lookup hashes
      const scripts = scriptFiles.map((file) => sriManifest[file]);

      return {
        routeRegex,
        scripts
      };
    });
  } catch(e) {
    console.error(e);
    return [];
  }
}
