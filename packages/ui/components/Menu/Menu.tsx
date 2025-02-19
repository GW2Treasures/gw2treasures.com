'use client';

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { cx } from '../../lib/classNames';
import * as React from 'react';
import { Icon } from '../../icons';
import { Button } from '../Form/Button';
import styles from '../DropDown/DropDown.module.css';

type MenuContextType = {
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHasFocusInside: React.Dispatch<React.SetStateAction<boolean>>;
  allowHover: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parent: MenuContextType | null;
};

const MenuContext = React.createContext<MenuContextType>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => {},
  setHasFocusInside: () => {},
  allowHover: true,
  isOpen: false,
  setIsOpen: () => {},
  parent: null,
});

interface MenuProps extends React.HTMLProps<HTMLButtonElement> {
  label: string;
  nested?: boolean;
  children?: React.ReactNode;
  keepMounted?: boolean;

  // TODO: remove
  orientation?: 'vertical' | 'horizontal' | 'both';
  cols?: number;
}

export const MenuComponent = React.forwardRef<
  HTMLButtonElement,
  MenuProps
>(function Menu(
  {
    children,
    label,
    keepMounted = false,
    cols,
    orientation: orientationOption,
    ...props
  },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [allowHover, setAllowHover] = React.useState(false);
  const [hasFocusInside, setHasFocusInside] = React.useState(false);

  const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;
  const orientation = orientationOption ?? (cols ? 'both' : 'vertical');

  const parent = React.useContext(MenuContext);
  const item = useListItem();

  const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? 'right-start' : 'bottom-start',
    middleware: [
      offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: isNested && allowHover,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: !isNested || !allowHover,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
    orientation,
    cols,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  React.useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on('click', handleTreeClick);
    tree.events.on('menuopen', onSubMenuOpen);

    return () => {
      tree.events.off('click', handleTreeClick);
      tree.events.off('menuopen', onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  React.useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit('menuopen', { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  React.useEffect(() => {
    function onPointerMove({ pointerType }: PointerEvent) {
      if (pointerType !== 'touch') {
        setAllowHover(true);
      }
    }

    function onKeyDown() {
      setAllowHover(false);
    }

    window.addEventListener('pointermove', onPointerMove, {
      once: true,
      capture: true,
    });
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, {
        capture: true,
      });
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [allowHover]);

  return (
    <FloatingNode id={nodeId}>
      <Button
        ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
        data-open={isOpen ? '' : undefined}
        appearance={isNested ? 'menu' : undefined}
        tabIndex={
          !isNested
            ? props.tabIndex
            : parent.activeIndex === item.index
              ? 0
              : -1
        }
        className={cx(
          props.className ||
            'text-left flex gap-4 justify-between items-center rounded py-1 px-2',
          {
            'focus:bg-blue-500 focus:text-white outline-none': isNested,
            'bg-blue-500 text-white': isOpen && isNested && !hasFocusInside,
            'bg-slate-200 rounded py-1 px-2':
              isNested && isOpen && hasFocusInside,
            'bg-slate-200': !isNested && isOpen,
          },
        )}
        {...getReferenceProps(
          parent.getItemProps({
            ...props,
            onFocus(event: React.FocusEvent<HTMLButtonElement>) {
              props.onFocus?.(event);
              setHasFocusInside(false);
              parent.setHasFocusInside(true);
            },
            onMouseEnter(event: React.MouseEvent<HTMLButtonElement>) {
              props.onMouseEnter?.(event);
              if (parent.allowHover && parent.isOpen) {
                parent.setActiveIndex(item.index);
              }
            },
          }),
        )}
      >
        {label}
        {isNested && (
          <span aria-hidden className="ml-4">
            <Icon icon="chevron-right"/>
          </span>
        )}
      </Button>
      <MenuContext.Provider
        value={{
          activeIndex,
          setActiveIndex,
          getItemProps,
          setHasFocusInside,
          allowHover,
          isOpen,
          setIsOpen,
          parent,
        }}
      >
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {(keepMounted || isOpen) && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={isNested ? -1 : 0}
                returnFocus={!isNested}
              >
                <div
                  ref={refs.setFloating}
                  className={cx(styles.dropdown, styles.content)}
                  style={{
                    display: cols ? undefined : 'flex',
                    flexDirection: cols ? undefined : 'column',
                    ...floatingStyles,
                    '--cols': cols,
                    visibility: !keepMounted
                      ? undefined
                      : isOpen
                        ? 'visible'
                        : 'hidden',
                  }}
                  aria-hidden={!isOpen}
                  {...getFloatingProps()}
                >
                  {children}
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
});

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<
  HTMLButtonElement,
  MenuItemProps
>(function MenuItem({ label, disabled, ...props }, forwardedRef) {
  const menu = React.useContext(MenuContext);
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;

  return (
    <Button
      {...props}
      ref={useMergeRefs([item.ref, forwardedRef])}
      type="button"
      role="menuitem"
      appearance="menu"
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      {...menu.getItemProps({
        active: isActive,
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit('click');
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          menu.setHasFocusInside(true);
        },
        onMouseEnter(event: React.MouseEvent<HTMLButtonElement>) {
          props.onMouseEnter?.(event);
          if (menu.allowHover && menu.isOpen) {
            menu.setActiveIndex(item.index);
          }
        },
        onKeyDown(event) {
          function closeParents(parent: MenuContextType | null) {
            parent?.setIsOpen(false);
            if (parent?.parent) {
              closeParents(parent.parent);
            }
          }

          if (
            event.key === 'ArrowRight' &&
            // If the root reference is in a menubar, close parents
            tree?.nodesRef.current[0].context?.elements.domReference?.closest(
              '[role="menubar"]',
            )
          ) {
            closeParents(menu.parent);
          }
        },
      })}
    >
      {label}
    </Button>
  );
});

export const Menu = React.forwardRef<
  HTMLButtonElement,
  MenuProps
>(function MenuWrapper(props, ref) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref}/>
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref}/>;
});
