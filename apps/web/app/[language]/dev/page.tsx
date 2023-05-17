import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import Link from 'next/link';

export default function DeveloperPage() {
  return (
    <HeroLayout hero={<Headline id="developer">Developer</Headline>} color="#2c8566">
      <Headline id="services">Services</Headline>
      <ul>
        <li><b><Link href="/dev/icons">Icons</Link></b>: Alternative to render.guildwars2.com with more features.</li>
      </ul>
    </HeroLayout>
  );
}
