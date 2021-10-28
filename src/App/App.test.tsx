import React from 'react';
import { render } from 'test-utils';
import { APMProvider } from 'apollo/provider';
import App from './App';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

test('renders the app', () => {
  const { container } = render(
    <APMProvider>
      <App />
    </APMProvider>,
  );
  const tabs = container.querySelectorAll('.transfers-tracing-app');
  expect(Array.from(tabs)).not.toHaveLength(0);
});
