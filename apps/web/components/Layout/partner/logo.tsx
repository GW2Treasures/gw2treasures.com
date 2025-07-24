import type { FC } from 'react';
import PartnerLogoWhite from './ArenanetPartnerLogo_Horizontal_SolidWhite.png';
import PartnerLogoBlack from './ArenanetPartnerLogo_Horizontal_SolidBlack.png';
import Link from 'next/link';

export const PartnerLogo: FC = () => {
  return (
    <Link href="/about#partner">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet={PartnerLogoWhite.src}/>
        <img src={PartnerLogoBlack.src} alt="ArenaNet Partner" height={48} width={(48 / PartnerLogoBlack.height) * PartnerLogoBlack.width}/>
      </picture>
    </Link>
  );
};
