import { KnownSchemaVersion } from '@gw2api/types/schema';

export const schemaVersion = '2022-03-23T19:00:00.000Z' satisfies KnownSchemaVersion;
export type SchemaVersion = typeof schemaVersion;

export const schema = `v2+${schemaVersion}`;
