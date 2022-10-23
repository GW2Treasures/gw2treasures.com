import { NextPage, GetServerSideProps, GetStaticProps } from 'next';
import { ReactNode } from 'react';
import { serialize, deserialize } from 'superjson/dist';
import { SuperJSONResult } from 'superjson/src/types'

interface SuperJSONComponentProps extends SuperJSONResult {
  children?: ReactNode,
}

export function withSuperProps<T>(Component: NextPage<T>): NextPage<SuperJSONComponentProps> {
  const WithSuperProps: NextPage<SuperJSONComponentProps> = ({ children, ...props }) => {
    const data = deserialize<T>(props);
    return <Component {...data}>{children}</Component>;
  };
  WithSuperProps.displayName = `withSuperProps(${Component.displayName || Component.name || 'Component'})`;

  return WithSuperProps;
}

export function getServerSideSuperProps<T extends { [key: string]: any }>(factory: GetServerSideProps<T>): GetServerSideProps<SuperJSONResult> {
  return async (data) => {
    const result = await factory(data);
    
    if('props' in result) {
      return {
        ...result,
        props: serialize(await result.props)
      };
    }

    return result;
  }
}

export function getStaticSuperProps<T extends { [key: string]: any }>(factory: GetStaticProps<T>): GetStaticProps<SuperJSONResult> {
  return async (data) => {
    const result = await factory(data);
    
    if('props' in result) {
      return {
        ...result,
        props: serialize(await result.props)
      };
    }

    return result;
  }
}

