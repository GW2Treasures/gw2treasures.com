import type { FC } from 'react';
import type { Thing, WithContext } from 'schema-dts';

export interface StructuredDataProps {
  data: Thing & object,
}

export const StructuredData: FC<StructuredDataProps> = ({ data }) => {
  const dataWithContext: WithContext<Thing> = {
    '@context': 'https://schema.org',
    ...data
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(dataWithContext)
    }}/>
  );
};
