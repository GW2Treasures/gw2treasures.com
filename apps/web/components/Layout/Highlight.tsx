import 'server-only';
import { type FC, Suspense } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { createStarryNight, common } from '@wooorm/starry-night';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import '@wooorm/starry-night/style/both';

interface HighlightProps {
  code: string;
  language: string;
}

export const Highlight: FC<HighlightProps> = ({ code, language }) => {
  return (
    <Suspense fallback={code}>
      <HighlightAsync code={code} language={language}/>
    </Suspense>
  );
};

const starryNightPromise = createStarryNight(common);

const HighlightAsync: FC<HighlightProps> = async ({ code, language }) => {
  const starryNight = await starryNightPromise;

  const scope = starryNight.flagToScope(language);

  if(!scope) {
    return (<>{code}</>);
  }

  const tree = starryNight.highlight(code, scope);
  // @ts-expect-error `jsx` and `jsxs` from react/jsx-runtime have bad types and are not compatible with hast-util-to-jsx-runtime
  const reactNode = toJsxRuntime(tree, { Fragment, jsx, jsxs });

  return reactNode;
};

