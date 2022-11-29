import { Item } from '@prisma/client';
import { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '../components/Form/Button';
import { TextInput } from '../components/Form/TextInput';
import { Headline } from '../components/Headline/Headline';
import { HeroLayout } from '../components/Layout/HeroLayout';

interface PageNotFoundProps {
  items: Item[];
}

const PageNotFound: NextPage<PageNotFoundProps> = ({ items }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <HeroLayout color="#b7000d" hero={<Headline id="404">404 - Page not found</Headline>}>
      We couldn't find the page you requested. You can try the search to find the content you were looking for.
    </HeroLayout>
  );
};

export default PageNotFound;
