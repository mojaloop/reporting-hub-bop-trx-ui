import { State } from 'store';
import transfersMock from 'App/Transfers/_mockData';
import transferDetailsMock from 'App/Transfers/TransferDetails/_mockData';
import buildApi, { buildEndpointBuilder, EndpointConfig } from '@modusbox/redux-utils/lib/api';

let baseUrl: string;
let mockApi: string;
if (process.env.NODE_ENV === 'production') {
  baseUrl = window.transferEnv.REACT_APP_API_BASE_URL;
  mockApi = window.transferEnv.REACT_APP_MOCK_API;
} else if (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_REMOTE_MOCK_API) {
  baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
  mockApi = process.env.REACT_APP_REMOTE_MOCK_API;
} else {
  baseUrl = '';
  mockApi = 'true';
}

const services = {
  reportingApi: {
    baseUrl,
    mock: () => mockApi === 'true',
  },
};

const builder = buildEndpointBuilder<State>();

const transfers: EndpointConfig = {
  service: services.reportingApi,
  url: (_: State, filters) => {
    // dont pass any undefined keys to URLSearchParams
    const sanitizedFilters = {
      ...filters,
    };

    Object.keys(sanitizedFilters).forEach((k) =>
      // @ts-ignore
      sanitizedFilters[k] === undefined ? delete sanitizedFilters[k] : null,
    );

    const queryString = new URLSearchParams(sanitizedFilters).toString();
    return `/transfers?${queryString}`;
  },
  mock: transfersMock,
};

const transferDetails: EndpointConfig = {
  service: services.reportingApi,
  url: (_: State, transferId: string) => `/transferDetails/${transferId}`,
  mock: transferDetailsMock,
};

export default buildApi({
  transfers: builder<{}>(transfers),
  transferDetails: builder<{}>(transferDetails),
});
