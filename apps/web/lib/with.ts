import { Icon } from '@prisma/client';

export type With<T, U> = T & U;

export type WithOptional<T, O> = With<T, { [P in keyof O]?: O[P] | null }>;

export type WithIcon<T> = WithOptional<T, { icon: Icon }>
