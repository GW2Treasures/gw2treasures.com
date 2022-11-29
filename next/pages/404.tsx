import { NextPage } from 'next';
import { Headline } from '../components/Headline/Headline';
import { HeroLayout } from '../components/Layout/HeroLayout';

interface PageNotFoundProps {
}

const PageNotFound: NextPage<PageNotFoundProps> = ({}) => {
  return (
    <HeroLayout color="#b7000d" hero={<Headline id="404">404 - Page not found</Headline>}>
      We couldn't find the page you requested. You can try the search to find the content you were looking for.
    </HeroLayout>
  );
};

export default PageNotFound;
