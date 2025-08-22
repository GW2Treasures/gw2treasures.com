import type { Metadata, ResolvedMetadata, ResolvingMetadata } from 'next';
import type { LayoutProps, PageProps } from './next';
import { getAlternateUrls, getCurrentUrl } from './url';
import type { StaticImageData } from 'next/image';
import type { TemplateString } from 'next/dist/lib/metadata/types/metadata-types';
import type { Twitter } from 'next/dist/lib/metadata/types/twitter-types';
import { getLanguage } from './translate';

export function createMetadata<Props extends PageProps | LayoutProps>(getMeta: ((props: Props) => Promise<Meta> | Meta) | Meta) {
  return async (props: Props, parent: ResolvingMetadata): Promise<Metadata> => {
    const meta = typeof getMeta === 'function' ? await getMeta(props) : getMeta;
    const language = await getLanguage();

    const url = await getCurrentUrl();
    const alternates = getAlternateUrls(meta.url ?? url.pathname, language);

    const parentMeta = await parent;

    const title = meta.ogTitle ??
      resolveTitle(meta.title, parentMeta.title).replace(' · gw2treasures.com', '');

    const image = resolveImage(meta.image, url);

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates,
      robots: meta.robots,

      openGraph: {
        ...parentMeta.openGraph,
        siteName: 'gw2treasures.com',
        images: image ?? parentMeta.openGraph?.images,
        url: alternates.canonical,
        title,
        description: meta.description ?? parentMeta.description ?? undefined
      },
      twitter: {
        ...parentMeta.twitter as Twitter,
        card: (image?.width && image.width > 128) ? 'summary_large_image' : parentMeta.twitter?.card as 'summary_large_image',
        title,
        description: meta.description ?? parentMeta.description ?? undefined
      },
    };
  };
}

type Meta = {
  title: string | TemplateString,
  ogTitle?: string,
  description?: string,
  keywords?: string[],
  url?: string,
  image?: Image,
  robots?: Metadata['robots']
};


function resolveTitle(title: string | TemplateString, template: undefined | ResolvedMetadata['title']) {
  if(typeof title === 'object' && 'absolute' in title) {
    return title.absolute;
  }

  const resolvedTitle = typeof title === 'object'
    ? title.default
    : title;

  if(!template || typeof template === 'string' || !template.template) {
    return resolvedTitle;
  }

  return template.template.replace('%s', resolvedTitle);
}

type Image = { src: URL | string, width: number, height: number };
type ResolvedImage = { url: URL, width: number, height: number };

// assert that StaticImageData can be assigned to Image
true satisfies StaticImageData extends Image ? true : false;

function resolveImage(image: Image | undefined, baseUrl: URL): ResolvedImage | undefined {
  if(!image) {
    return undefined;
  }

  return {
    url: new URL(image.src, baseUrl),
    width: image.width,
    height: image.height
  };
}
