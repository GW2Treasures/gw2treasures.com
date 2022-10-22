import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useReducer, useState } from "react";
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
  const [anchors, updateAnchors] = useReducer((state: Anchor[], action: Action) => {
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

  return <Context.Provider value={{ anchors, registerAnchor }}>{children}</Context.Provider>
}

export interface TableOfContentAnchorProps {
  id: string;
  children?: ReactNode;
}

export const TableOfContentAnchor: FC<TableOfContentAnchorProps> = ({ id, children }) => {
  const context = useContext(Context);
  const [element, setElement] = useState<HTMLAnchorElement>();

  useEffect(() => {
    if(element) {
      return context.registerAnchor({ id, element, label: children ?? id });
    }
  }, [id, element, children]);

  return <a key={id} id={id} ref={setElement} className={styles.anchor}/>;
};

interface TableOfContentProps {};

export const TableOfContent: FC<TableOfContentProps> = ({  }) => {
  const { anchors } = useContext(Context);
  const [activeId, setActiveId] = useState<string>(anchors[0]?.id);

  useEffect(() => {
    const listener = () => {
      const scrollTop = window.scrollY;
      console.log(scrollTop);
      
      let topAnchor = anchors[0];
      for(const anchor of anchors) {
        console.log(anchor.id, anchor.element.offsetTop);
        if(anchor.element.offsetTop - scrollTop <= 0) {
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
          <a href={`#${id}`} className={activeId === id ? styles.activeLink : styles.link} onClick={(e) => { e.preventDefault(); element.scrollIntoView(); setActiveId(id) }}>{label}</a>
        </li>
      ))}
    </ol>
  );
};
