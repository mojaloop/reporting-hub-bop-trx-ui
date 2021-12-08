import React, { FC } from 'react';
import {
  Heading,
  Button,
  MessageBox,
  Spinner,
  Table,
  DatePicker,
  TextField,
  Select,
} from 'components';
import { connect } from 'react-redux';
import withMount from 'hocs';
import { State, Dispatch } from 'store/types';
import { ReduxContext } from 'store';
import { useLazyQuery } from '@apollo/client';
import { GET_TRANSFER, GET_TRANSFERS_WITH_EVENTS } from 'apollo/query';
import { DFSP, Party, Transfer } from 'apollo/types';
import { Collapse } from 'antd';
import moment from 'moment';
import { TransfersFilter, FilterChangeValue, DateRanges } from './types';
import { actions } from './slice';
import * as selectors from './selectors';
import './Transfers.scss';
import TransferDetailsModal from './TransferDetails';
import JsonModal from './JsonModal';
import PartyModal from './PartyModal';
import Dashboard from './Dashboard';
import { dateRanges, partyIdTypeOptions, transferStateOptions } from './constants';

const { Panel } = Collapse;
const transfersColumns = [
  {
    label: 'Transfer ID',
    key: 'transferId',
  },
  {
    label: 'State',
    key: 'transferState',
  },
  {
    label: 'Type',
    key: 'transactionType',
  },
  {
    label: 'Currency',
    key: 'currency',
  },
  {
    label: 'Amount',
    key: 'amount',
    fn: (rawValue: Number) => {
      return `${rawValue ? rawValue.toString() : ''}`;
    },
    sort: (lValue: Transfer, rValue: Transfer) => {
      return (lValue.amount || 0) - (rValue.amount || 0);
    },
  },
  {
    label: 'Payer DFSP',
    key: 'payerDFSP',
    fn: (rawValue: DFSP) => {
      return `${rawValue ? rawValue.name : ''}`;
    },
  },
  {
    label: 'Payee DFSP',
    key: 'payeeDFSP',
    fn: (rawValue: DFSP) => {
      return `${rawValue ? rawValue.name : ''}`;
    },
  },
  {
    label: 'Settlement Batch',
    key: 'settlementId',
    fn: (rawValue: Number) => {
      return `${rawValue ? rawValue.toString() : ''}`;
    },
  },
  {
    label: 'Date Submitted',
    key: 'createdAt',
    fn: (rawValue: Number) => {
      return `${rawValue ? moment(rawValue.toString()).local().format() : ''}`;
    },
  },
];

function fromDate(value: Date | undefined): string | undefined {
  if (value) {
    return value.toISOString();
  }
  return value;
}

const stateProps = (state: State) => ({
  valueTransfer: selectors.getSelectedTransfer(state),
  filtersModel: selectors.getTransfersFilter(state),
  jsonObject: selectors.getSelectedJsonModalData(state),
  partyObject: selectors.getSelectedPartyModalData(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onClearFiltersClick: () => dispatch(actions.clearTransferFinderFilters()),
  onTransferSelect: (transfer: Transfer) => dispatch(actions.selectTransfer(transfer)),
  onFilterChange: (field: string, value: FilterChangeValue | string) =>
    dispatch(actions.setTransferFinderFilter({ field, value })),
});

interface ConnectorProps {
  jsonObject: Object | undefined;
  partyObject: Party | undefined;
  valueTransfer: Transfer | undefined;
  transfers: Transfer[];
  filtersModel: TransfersFilter;
  onClearFiltersClick: () => void;
  onTransferSelect: (transfer: Transfer) => void;
  onFilterChange: (field: string, value: FilterChangeValue | string) => void;
}

const DateFilters: FC<DateFiltersProps> = ({ model, onFilterChange, onClearFiltersClick }) => {
  return (
    <div className="transfers__filters">
      <div className="transfers__filters__filter-row">
        <TextField
          className="transfers__filters__textfield"
          placeholder="Transfer ID"
          size="small"
          value={model?.transferId}
          onChange={(value) => onFilterChange('transferId', value)}
        />
        <Button
          noFill
          className="transfers__filters__date-filter"
          size="small"
          kind="danger"
          label="Clear Filters"
          onClick={() => {
            onClearFiltersClick();
          }}
        />
      </div>
      <div className="transfers__filters__filter-row">
        <Select
          className="transfers__filters__date-filter"
          kind="primary"
          size="small"
          onChange={(value: string) => {
            if (value === DateRanges.PastTwentyFour) {
              onFilterChange('from', fromDate(moment().subtract(1, 'days').toDate()));
              onFilterChange('to', fromDate(moment().toDate()));
            }
            if (value === DateRanges.Today) {
              onFilterChange('from', fromDate(moment().startOf('day').toDate()));
              onFilterChange('to', fromDate(moment().endOf('day').toDate()));
            }
            if (value === DateRanges.PastFortyEight) {
              onFilterChange('from', fromDate(moment().subtract(2, 'days').toDate()));
              onFilterChange('to', fromDate(moment().toDate()));
            }
            if (value === DateRanges.PastWeek) {
              onFilterChange('from', fromDate(moment().subtract(1, 'week').toDate()));
              onFilterChange('to', fromDate(moment().toDate()));
            }
            if (value === DateRanges.PastMonth) {
              onFilterChange('from', fromDate(moment().subtract(1, 'month').toDate()));
              onFilterChange('to', fromDate(moment().toDate()));
            }
            if (value === DateRanges.PastYear) {
              onFilterChange('from', fromDate(moment().subtract(1, 'year').toDate()));
              onFilterChange('to', fromDate(moment().toDate()));
            }
            onFilterChange('timeframeSelect', value);
          }}
          value={model.timeframeSelect}
          options={dateRanges}
          placeholder="Choose a value"
        />
        <DatePicker
          className="transfers__filters__date-filter"
          size="small"
          id="filter_date_from"
          format="yyyy-MM-dd'T'HH:mm:ss xxx"
          value={model && model.from ? new Date(model.from).toISOString() : undefined}
          placeholder="From"
          onChange={(value) => {
            onFilterChange('from', fromDate(value));
            onFilterChange('timeframeSelect', DateRanges.Custom);
          }}
          withTime
        />
        <DatePicker
          className="transfers__filters__date-filter"
          size="small"
          id="filter_date_to"
          format="yyyy-MM-dd'T'HH:mm:ss xxx"
          value={model && model.to ? new Date(model.to).toISOString() : undefined}
          placeholder="To"
          onChange={(value) => {
            onFilterChange('to', fromDate(value));
            onFilterChange('timeframeSelect', DateRanges.Custom);
          }}
          withTime
        />
      </div>
    </div>
  );
};

const Filters: FC<TransferFiltersProps> = ({ model, onFilterChange, onFindTransfersClick }) => {
  return (
    <div className="transfers__filters">
      <div className="transfers__filters__filter-row">
        <TextField
          className="transfers__filters__textfield"
          placeholder="Payer FSPID"
          size="small"
          value={model?.payerFSPId}
          onChange={(value) => onFilterChange('payerFSPId', value)}
        />
        <Select
          className="transfers__filters__select"
          size="small"
          id="filter_payerIdType"
          placeholder="Payer ID Type"
          options={partyIdTypeOptions}
          value={model?.payerIdType}
          onClear={() => onFilterChange('payerIdType', undefined)}
          onChange={(value) => onFilterChange('payerIdType', value as string)}
        />
        <TextField
          className="transfers__filters__textfield"
          placeholder="Payer ID Value"
          size="small"
          value={model?.payerIdValue}
          onChange={(value) => onFilterChange('payerIdValue', value)}
        />
      </div>
      <div className="transfers__filters__filter-row">
        <TextField
          className="transfers__filters__textfield"
          placeholder="Payee FSPID"
          size="small"
          value={model?.payeeFSPId}
          onChange={(value) => onFilterChange('payeeFSPId', value)}
        />
        <Select
          className="transfers__filters__select"
          size="small"
          id="filter_payeeIdType"
          placeholder="Payee ID Type"
          options={partyIdTypeOptions}
          value={model?.payeeIdType}
          onClear={() => onFilterChange('payeeIdType', undefined)}
          onChange={(value) => onFilterChange('payeeIdType', value as string)}
        />
        <TextField
          className="transfers__filters__textfield"
          placeholder="Payee ID Value"
          size="small"
          value={model?.payeeIdValue}
          onChange={(value) => onFilterChange('payeeIdValue', value)}
        />
      </div>
      <div className="transfers__filters__filter-row">
        <TextField
          className="transfers__filters__textfield"
          placeholder="Currency"
          size="small"
          value={model?.currency}
          onChange={(value) => onFilterChange('currency', value)}
        />
        <Select
          className="transfers__filters__select"
          size="small"
          placeholder="Transfer State"
          options={transferStateOptions}
          value={model?.transferState}
          onClear={() => onFilterChange('transferState', undefined)}
          onChange={(value) => onFilterChange('transferState', value as string)}
        />
        <Button
          className="transfers__filters__find"
          size="small"
          kind="primary"
          label="Find Transfers"
          onClick={onFindTransfersClick}
        />
      </div>
    </div>
  );
};

const Transfers: FC<ConnectorProps> = ({
  valueTransfer,
  transfers,
  filtersModel,
  jsonObject,
  partyObject,
  onClearFiltersClick,
  onTransferSelect,
  onFilterChange,
}) => {
  let content = null;
  const [getTransfers, { loading, error, data }] = useLazyQuery(
    filtersModel.transferId ? GET_TRANSFER : GET_TRANSFERS_WITH_EVENTS,
    {
      fetchPolicy: 'no-cache',
      variables: filtersModel.transferId
        ? { transferId: filtersModel.transferId }
        : {
            startDate: filtersModel.from,
            endDate: filtersModel.to,
            currency: filtersModel.currency,
            transferState: filtersModel.transferState,
            payeeFSPId: filtersModel.payeeFSPId,
            payerFSPId: filtersModel.payerFSPId,
            payeeIdType: filtersModel.payeeIdType,
            payerIdType: filtersModel.payerIdType,
            payeeIdValue: filtersModel.payeeIdValue,
            payerIdValue: filtersModel.payerIdValue,
          },
    },
  );

  if (error) {
    content = <MessageBox kind="danger">Error fetching transfers: {error.message}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    let rows;
    if (data && data.transfer) {
      rows = [data.transfer];
    } else if (data && data.transfers) {
      rows = data.transfers;
    } else {
      rows = [];
    }
    content = (
      <Table
        columns={transfersColumns}
        rows={rows}
        pageSize={20}
        paginatorSize={7}
        flexible
        onSelect={onTransferSelect}
      />
    );
  }

  let warning = null;
  if (transfers && transfers.length >= 500) {
    warning = (
      <MessageBox kind="warning">
        Your search returned over 500 results. Only the first 1000 will be displayed. Try narrowing
        your search with the available filters.
      </MessageBox>
    );
  }

  let detailModal = null;
  if (valueTransfer) {
    detailModal = <TransferDetailsModal />;
  }

  let jsonObjectModal = null;
  if (jsonObject) {
    jsonObjectModal = <JsonModal />;
  }

  let partyObjectModal = null;
  if (partyObject) {
    partyObjectModal = <PartyModal />;
  }

  return (
    <div>
      <Heading size="3">Find Transfers</Heading>
      <DateFilters
        model={filtersModel}
        onFilterChange={onFilterChange}
        onClearFiltersClick={onClearFiltersClick}
      />
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Overview for Date Range" key={1}>
          <Dashboard />
        </Panel>
      </Collapse>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Transfer List Filters" key={1}>
          <Filters
            model={filtersModel}
            onFilterChange={onFilterChange}
            onFindTransfersClick={getTransfers}
          />
        </Panel>
      </Collapse>
      {warning}
      {content}
      {detailModal}
      {jsonObjectModal}
      {partyObjectModal}
    </div>
  );
};

interface TransferFiltersProps {
  model: TransfersFilter;
  onFilterChange: (field: string, value: FilterChangeValue) => void;
  onFindTransfersClick: () => void;
}

interface DateFiltersProps {
  model: TransfersFilter;
  onFilterChange: (field: string, value: FilterChangeValue) => void;
  onClearFiltersClick: () => void;
}

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(
  withMount(Transfers, 'onMount'),
);
