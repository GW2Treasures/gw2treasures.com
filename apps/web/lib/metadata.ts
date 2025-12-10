import type { Metadata, ResolvedMetadata, ResolvingMetadata } from 'next';
import { getAlternateUrls, getBaseUrl } from './url';
import type { StaticImageData } from 'next/image';
import type { TemplateString } from 'next/dist/lib/metadata/types/metadata-types';
import type { Twitter } from 'next/dist/lib/metadata/types/twitter-types';
import { getLanguage } from './translate';
import type { Language } from '@gw2treasures/database';
import type { AppRoutes, LayoutRoutes } from '.next/types/routes';

interface CreateMetadataContext {
  language: Language,
}

type CreateMetadataCallback<T, M extends LayoutMeta | Meta> = (props: T, context: CreateMetadataContext) => Promise<M> | M;

type GenerateMetadata<T> = (props: T, parent: ResolvingMetadata) => Promise<Metadata>;

export function createLayoutMetadata<LayoutRoute extends LayoutRoutes>(
  getMeta: CreateMetadataCallback<LayoutProps<LayoutRoute>, LayoutMeta> | LayoutMeta
): GenerateMetadata<LayoutProps<LayoutRoute>> {
  return async (props, parent) => {// get current language (root param)
    const language = await getLanguage();

    // get meta from callback or object
    const meta = typeof getMeta === 'function'
      ? await getMeta(props, { language })
      : getMeta;

    // get metadata from parent layouts
    const parentMeta = await parent;

    // generate title
    const title = meta.ogTitle ??
      resolveTitle(meta.title, parentMeta.title).replace(' · gw2treasures.com', '');

    // resolve absolute image url
    const image = resolveImage(meta.image, getBaseUrl(language));

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      robots: meta.robots,

      openGraph: {
        ...parentMeta.openGraph,
        siteName: 'gw2treasures.com',
        images: image ?? parentMeta.openGraph?.images,
        url: undefined,
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

export function createMetadata<AppRoute extends AppRoutes>(
  getMeta: CreateMetadataCallback<PageProps<AppRoute>, Meta> | Meta
): GenerateMetadata<PageProps<AppRoute>> {
  return async (props, parent) => {
    // get current language (root param)
    const language = await getLanguage();

    // get meta from callback or object
    const meta = typeof getMeta === 'function'
      ? await getMeta(props, { language })
      : getMeta;

    // generate alternate urls
    const alternates = getAlternateUrls(meta.url, language);

    // get metadata from parent layouts
    const parentMeta = await parent;

    // generate title
    const title = meta.ogTitle ??
      resolveTitle(meta.title, parentMeta.title).replace(' · gw2treasures.com', '');

    // resolve absolute image url
    const image = resolveImage(meta.image, getBaseUrl(language));

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

type LayoutMeta = {
  title: string | TemplateString,
  ogTitle?: string,
  description?: string,
  keywords?: string[],
  image?: Image,
  robots?: Metadata['robots'],
};

type Meta = {
  title: string | TemplateString,
  ogTitle?: string,
  description?: string,
  keywords?: string[],
  url: string,
  image?: Image,
  robots?: Metadata['robots'],
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
