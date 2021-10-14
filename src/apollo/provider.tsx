import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloProvider } from '@apollo/client';
import { client } from './client';
import { transfersQueryMock } from './mocks';

interface ProviderProps {
  useMocks?: boolean;
}

export const APMProvider: React.FC<ProviderProps> = ({ useMocks, children }) => {
  if (useMocks)
    return (
      <MockedProvider mocks={[transfersQueryMock]}>
        <>{children}</>
      </MockedProvider>
    );
  return (
    <ApolloProvider client={client}>
      <>{children}</>
    </ApolloProvider>
  );
};
