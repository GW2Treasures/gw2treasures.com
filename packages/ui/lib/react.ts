import type { Ref } from 'react';

export interface RefProp<T = Element> {
  ref?: Ref<T>
}
