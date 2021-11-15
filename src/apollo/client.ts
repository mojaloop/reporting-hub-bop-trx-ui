import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { schemaLink } from './schema';

export const cache = new InMemoryCache({
  typePolicies: {
    // Transfer uses `transferId` instead of a generic `id`
    Transfer: {
      keyFields: ['transferId'],
    },
    // Party `id` seems to be `null` using the reporting api.
    // So we use `idType` and `idValue` for the cache key.
    Party: {
      keyFields: ['idType', 'idValue'],
    },
    // TransferSummary has no unique identifier so whenever a TransferSummary
    // Query is made you must specify fetchPolicy: 'no-cache'.
    // DFSP uses a generic `id`. No need to specify since Apollo Client defaults
    // to `id`.
  },
});

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
