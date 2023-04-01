'use client';

import { useHydrated } from '@/lib/useHydrated';
import { cloneElement, FC, MutableRefObject, ReactElement, RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DropDown } from '../DropDown/DropDown';
import { Button } from '../Form/Button';

export interface OverflowProps {
  children: ReactElement[];
}

export const Overflow: FC<OverflowProps> = ({ children }) => {
  const childRefs = useRef<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const hydrated = useHydrated();

  return (
    <div ref={containerRef} style={{ display: 'flex', width: '100%' }}>
      {children.map((child, index) => cloneElement(child, { ref: (ref: HTMLElement) => childRefs.current[index] = ref, key: child.key ?? index }))}
      {hydrated && <OverflowButton containerRef={containerRef} childRefs={childRefs}/>}
    </div>
  );
};

const OverflowButton: FC<{ containerRef: RefObject<HTMLElement>, childRefs: MutableRefObject<HTMLElement[]> }> = ({ containerRef, childRefs }) => {
  const moreRef = useRef<HTMLButtonElement>(null);

  const [renderedItems, setRenderedItems] = useState(0);

  const calculate = useCallback(() => {
    if(!containerRef.current || !moreRef.current) {
      return;
    }
    moreRef.current.style.display = '';

    const maxWidth = containerRef.current?.offsetWidth;
    const buttonWidth = moreRef.current.offsetWidth;
    let rendered = 0;

    let width = buttonWidth;
    for(const child of childRefs.current) {
      if(width < maxWidth) {
        child.style.display = '';
      }

      const childWidth = child.offsetWidth;
      width += childWidth;

      if(width <= maxWidth) {
        rendered++;
      }

      child.style.display = width > maxWidth ? 'none' : '';
    }

    moreRef.current.style.display = width <= maxWidth ? 'none' : '';
  }, [childRefs, containerRef]);

  useLayoutEffect(calculate);

  useEffect(() => {
    window.addEventListener('resize', calculate, { passive: true });

    () => window.removeEventListener('resize', calculate);
  });

  return (
    <DropDown button={<Button ref={moreRef}>More</Button>}>
      Dropdown
    </DropDown>
  );
};
