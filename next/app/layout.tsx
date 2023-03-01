import '../styles/globals.css';
import '../styles/variables.css';

import { FormatProvider } from '@/components/Format/FormatContext';
import Layout from '@/components/Layout/Layout';
import { Bitter } from 'next/font/google';
import localFont from 'next/font/local';
import { cx } from '@/lib/classNames';

const __html = `
/**
 * !!WARNING!!
 * TEMPORARILY WORKAROUND A REACT DEVTOOLS ISSUE https://github.com/facebook/react/issues/25994
 * REMOVE AFTER THE ISSUE IS FIXED
 */
// Save the original __REACT_DEVTOOLS_GLOBAL_HOOK__.inject
const reactDevToolsHookInject = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject;
// Override the original __REACT_DEVTOOLS_GLOBAL_HOOK__.inject
// This will allow us to intercept and modify incoming injectProfilingHooks
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function inject(...args) {
  const newArgs = args.map(arg => {
    // Only modify the original arguments when injectProfilingHooks is present
    if (!arg || !arg.injectProfilingHooks) return arg;

    const { injectProfilingHooks: originalInjectProfilingHooks, ...rest } = arg;
    return {
      // Override the original injectProfilingHooks
      // This will allow us to intercept and modify incoming hooks
      injectProfilingHooks(...hooks) {
        const newHooks = hooks.map(hook => {
          // Only modify the original hooks when markComponentSuspended is present
          if (!hook || !hook.markComponentSuspended) return hook;

          // Override the original markComponentSuspended from the hook
          const { markComponentSuspended: orignalMarkComponentSuspended, ...rest2 } = hook;
          return {
            markComponentSuspended(fiber, wakeable, lanes) {
              if (typeof wakeable.then === 'function') {
                return orignalMarkComponentSuspended.call(this, fiber, wakeable, lanes);
              } else {
                // If "wakeable.then" is not a function, log a warning.
                console.warn('React DevTools issue detected and mitigated! See https://github.com/facebook/react/issues/25994 for more information.', { fiber, wakeable, lanes });
              }
            },
            ...rest2
          };
        });
        originalInjectProfilingHooks.apply(this, newHooks);
      },
      ...rest
    };
  });
  return reactDevToolsHookInject.apply(this, newArgs);
};
`;

const bitter = Bitter({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bitter',
});

const wotfard = localFont({
  src: [
    { path: '../fonts/wotfard-regular-webfont.woff2', weight: '400' },
    { path: '../fonts/wotfard-medium-webfont.woff2', weight: '500' },
  ],
  variable: '--font-wotfard',
});

// Don't preload fonts that are never or not often used
const wotfardExtra = localFont({
  src: [
    { path: '../fonts/wotfard-thin-webfont.woff2', weight: '200' },
    { path: '../fonts/wotfard-extralight-webfont.woff2', weight: '300' },
    { path: '../fonts/wotfard-semibold-webfont.woff2', weight: '600' },
    { path: '../fonts/wotfard-bold-webfont.woff2', weight: '700' }
  ],
  variable: '--font-wotfard-extra',
  preload: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cx(bitter.variable, wotfard.variable, wotfardExtra.variable)}>
      <body>
        <FormatProvider><Layout>{children}</Layout></FormatProvider>
        <script dangerouslySetInnerHTML={{ __html }}/>
      </body>
    </html>
  );
}
