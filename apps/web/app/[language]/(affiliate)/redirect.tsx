import type { FC } from 'react';

export interface RedirectProps {
  href: string,
}

export const Redirect: FC<RedirectProps> = ({ href }) => {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${href}`}/>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <div style={{ fontSize: 18, marginBottom: 8 }}>You will be redirected shortly...</div>
        <div style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>If you are not redirected, <a href={href}>click here</a>.</div>
      </div>
    </>
  );
};
