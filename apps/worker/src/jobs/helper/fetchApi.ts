import chalk from 'chalk';
import { db } from '../../db';
import { schemaVersion as schema, SchemaVersion } from './schema';
import { fetchGw2Api, FetchOptions } from '@gw2api/fetch';
import { EndpointType, KnownEndpoint, OptionsByEndpoint } from '@gw2api/types/endpoints';

const fetchOptions: FetchOptions = {};

type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

type Args<Url extends string> = RequiredKeys<OptionsByEndpoint<Url>> extends never
  ? [url: Url, options?: OptionsByEndpoint<Url>]
  : [url: Url, options: OptionsByEndpoint<Url>]

export async function fetchApi<Url extends KnownEndpoint | NonNullable<string>>(
  ...[url, options]: Args<Url>
): Promise<EndpointType<Url, SchemaVersion>> {
  const startTime = performance.now();
  const [endpoint, queryParameters = ''] = url.split('?');
  let rawResponse: Response | undefined = undefined as Response | undefined;

  try {
    return await fetchGw2Api<Url, SchemaVersion>(url, {
      schema,
      onResponse: (r) => { rawResponse = r; },
      ...(options as OptionsByEndpoint<Url>),
      ...fetchOptions
    });
  } finally {
    const responseTimeMs = performance.now() - startTime;

    const endpointWithQueryKeys = endpoint + (queryParameters ? '?' + [...new URLSearchParams(queryParameters).keys()].join('&') : '');
    const language = options && 'language' in options ? chalk.dim.magenta(` [${options.language}]`) : '';
    const status = rawResponse?.ok ? chalk.green(rawResponse.status) : chalk.red(rawResponse?.status ?? 'error');
    console.log(`> ${chalk.magenta(endpointWithQueryKeys)}${language} ${status} ${chalk.gray(`(${Math.round(responseTimeMs)} ms)`)}`);

    await db.apiRequest.create({
      data: {
        endpoint, queryParameters, responseTimeMs,
        status: rawResponse?.status ?? -1,
        statusText: rawResponse?.statusText ?? 'error',
      }
    });
  }
}
