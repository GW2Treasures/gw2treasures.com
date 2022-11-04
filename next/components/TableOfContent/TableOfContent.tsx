import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import styles from './TableOfContent.module.css';

type Anchor = { id: string, element: HTMLElement, label: ReactNode };

const Context = createContext<{ anchors: Anchor[], registerAnchor: (anchor: Anchor) => () => void } | undefined>(undefined);

export interface TableOfContentContextProps {
  children: ReactNode;
}

type Action = {
  type: 'register',
  anchor: Anchor,
} | {
  type: 'unregister',
  anchor: Anchor,
};

export const TableOfContentContext: FC<TableOfContentContextProps> = ({ children }) => {
  const [anchors, updateAnchors] = useReducer((state: Anchor[], action: Action): Anchor[] => {
    switch(action.type) {
      case 'register':
        return [...state, action.anchor].sort((a, b) => a.element.compareDocumentPosition(b.element) === Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      case 'unregister':
        return state.filter((anchor) => anchor !== action.anchor);
      default: throw new Error();
    }
  }, []);

  const registerAnchor = useCallback((anchor: Anchor) => {
    updateAnchors({ type: 'register', anchor });
    return () => updateAnchors({ type: 'unregister', anchor });
  }, [updateAnchors]);

  return (
    <Context.Provider value={{ anchors, registerAnchor }}>{children}</Context.Provider>
  );
};

export interface TableOfContentAnchorProps {
  id: string;
  children?: ReactNode;
}

export const TableOfContentAnchor: FC<TableOfContentAnchorProps> = ({ id, children }) => {
  const { registerAnchor } = useContext(Context) ?? { registerAnchor: () => {} };
  const [element, setElement] = useState<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if(element) {
      return registerAnchor({ id, element, label: children ?? id });
    }
  }, [registerAnchor, id, element, children]);

  return <a key={id} id={id} ref={setElement} className={styles.anchor} tabIndex={-1}/>;
};

interface TableOfContentProps {};

export const TableOfContent: FC<TableOfContentProps> = ({ }) => {
  const { anchors } = useContext(Context) ?? { anchors: [] };
  const [activeId, setActiveId] = useState<string>(anchors[0]?.id);

  useEffect(() => {
    const listener = () => {
      const scrollTop = window.scrollY;

      let topAnchor = anchors[0];
      for(const anchor of anchors) {
        if(anchor.element.offsetTop - scrollTop <= 16) {
          topAnchor = anchor;
        } else {
          break;
        }
      }

      topAnchor && setActiveId(topAnchor.id);
    };
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, [anchors]);

  useEffect(() => {
    if(activeId === undefined) {
      setActiveId(anchors[0]?.id);
    }
  }, [activeId, anchors]);

  return (
    <ol className={styles.toc}>
      {anchors.map(({ id, element, label }) => (
        <li key={id} className={styles.item}>
          <a href={`#${id}`} className={activeId === id ? styles.activeLink : styles.link} onClick={(e) => { e.preventDefault(); element.scrollIntoView(); setActiveId(id); element.focus(); }}>{label}</a>
        </li>
      ))}
    </ol>
  );
};
