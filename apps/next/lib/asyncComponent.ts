import { FunctionComponent, ReactElement } from 'react';

export interface AsyncComponent<P = {}> extends Omit<FunctionComponent<P>, ''> {
  (props: P, context?: any): Promise<ReactElement<any, any> | null>;
}
