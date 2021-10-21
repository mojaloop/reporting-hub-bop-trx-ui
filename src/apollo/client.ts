import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { schemaLink } from './schema';

export const cache = new InMemoryCache();

let baseUrl: string;
if (process.env.NODE_ENV === 'production') {
  baseUrl = window.transferEnv.REACT_APP_API_BASE_URL;
} else if (process.env.REACT_APP_API_BASE_URL) {
  baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
} else {
  baseUrl = '';
}

const link = createHttpLink({
  uri: baseUrl,
  credentials: 'include',
});

export const client = new ApolloClient({
  connectToDevTools: true,
  link: ApolloLink.from([link, schemaLink as unknown as ApolloLink]),
  cache,
  resolvers: {},
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
  },
});
