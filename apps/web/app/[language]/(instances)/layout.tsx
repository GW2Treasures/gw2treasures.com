import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function InstancesLayout({ children }: LayoutProps<'/[language]/homestead'>) {
  return (
    <HeroLayout color="#795548"
      hero={<Headline id="instances"><Trans id="navigation.instances"/></Headline>}
      navBar={(
        <NavBar base="/" items={[
          { segment: 'fractals', icon: 'fractals', label: <Trans id="fractals"/> },
          { segment: 'raids', icon: 'raid', label: <Trans id="raids"/> },
          { segment: 'dungeons', icon: 'dungeon', label: <Trans id="dungeons"/> },
        ]}/>
      )}
    >
      <>
        {children}
      </>
    </HeroLayout>
  );
}
