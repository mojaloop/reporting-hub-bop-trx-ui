import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloProvider, DefaultOptions } from '@apollo/client';
import { client } from './client';
import {
  transfersQueryMock,
  transferSummary,
  transferSummaryByCurrencyQueryMock,
  transferSummaryByPayeeDFSPQueryMock,
  transferSummaryByPayerDFSPQueryMock,
  transferSummaryErrorsByCurrencyQueryMock,
  transferSummaryErrorsByPayeeDFSPQueryMock,
  transferSummaryErrorsByPayerDFSPQueryMock,
} from './mocks';

let mockApi: boolean;
if (process.env.NODE_ENV === 'production') {
  mockApi = window.transferEnv.REACT_APP_MOCK_API === 'true';
} else if (process.env.REACT_APP_MOCK_API) {
  mockApi = process.env.REACT_APP_MOCK_API === 'true';
} else {
  mockApi = true;
}

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

export const APMProvider: React.FC<Object> = ({ children }) => {
  if (mockApi)
    return (
      <MockedProvider
        defaultOptions={defaultOptions}
        mocks={[
          transfersQueryMock,
          transferSummaryByCurrencyQueryMock,
          transferSummaryByPayerDFSPQueryMock,
          transferSummaryByPayeeDFSPQueryMock,
          transferSummaryErrorsByCurrencyQueryMock,
          transferSummaryErrorsByPayerDFSPQueryMock,
          transferSummaryErrorsByPayeeDFSPQueryMock,
          transferSummary,
        ]}
      >
        <>{children}</>
      </MockedProvider>
    );
  return (
    <ApolloProvider client={client}>
      <>{children}</>
    </ApolloProvider>
  );
};
