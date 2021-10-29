import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloProvider } from '@apollo/client';
import { WildcardMockLink } from 'wildcard-mock-link';
import { client } from './client';
import {
  transfersQueryMock,
  transferSummary,
  transferSummaryByCurrencyQueryMock,
  transferSummaryByPayeeDFSPQueryMock,
  transferSummaryByPayerDFSPQueryMock,
} from './mocks';

let mockApi: boolean;
if (process.env.NODE_ENV === 'production') {
  mockApi = window.transferEnv.REACT_APP_MOCK_API === 'true';
} else if (process.env.REACT_APP_MOCK_API) {
  mockApi = process.env.REACT_APP_MOCK_API === 'true';
} else {
  mockApi = true;
}

const link = new WildcardMockLink(
  [
    transfersQueryMock,
    transferSummary,
    transferSummaryByCurrencyQueryMock,
    transferSummaryByPayeeDFSPQueryMock,
    transferSummaryByPayerDFSPQueryMock,
  ],
  { addTypename: true },
);

export const APMProvider: React.FC<Object> = ({ children }) => {
  if (mockApi)
    return (
      <MockedProvider link={link}>
        <>{children}</>
      </MockedProvider>
    );
  return (
    <ApolloProvider client={client}>
      <>{children}</>
    </ApolloProvider>
  );
};
