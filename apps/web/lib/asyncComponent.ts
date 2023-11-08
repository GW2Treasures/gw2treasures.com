import type { FC, ReactElement } from 'react';

export interface AsyncComponent<P = {}> extends Omit<FC<P>, ''> {
  (props: P, context?: any): Promise<ReactElement<any, any> | null>;
}
