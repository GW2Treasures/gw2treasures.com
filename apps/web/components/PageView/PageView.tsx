import { type FC, Suspense } from 'react';
import { pageView } from '@/lib/pageView';
import 'server-only';

interface PageViewProps {
  page: string;
};

// run this in a suspense, so this does not block rendering
export const PageView: FC<PageViewProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <PageViewInternal {...props}/>
    </Suspense>
  );
};

const PageViewInternal: FC<PageViewProps> = async ({ page }) => {
  await pageView(page);

  return null;
};
