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
import { GET_TRANSFERS_WITH_EVENTS } from 'apollo/query';
import { DFSP, Party, Transfer } from 'apollo/types';
import { TransfersFilter, FilterChangeValue } from './types';
import { actions } from './slice';
import * as selectors from './selectors';
import './Transfers.scss';
import TransferDetailsModal from './TransferDetails';
import JsonModal from './JsonModal';
import PartyModal from './PartyModal';

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
      return `${rawValue.toString()}`;
    },
  },
  {
    label: 'Payer DFSP',
    key: 'payerDFSP',
    fn: (rawValue: DFSP) => {
      return `${rawValue.name}`;
    },
  },
  {
    label: 'Payee DFSP',
    key: 'payeeDFSP',
    fn: (rawValue: DFSP) => {
      return `${rawValue.name}`;
    },
  },
  {
    label: 'Settlement Batch',
    key: 'settlementId',
    fn: (rawValue: Number) => {
      return `${rawValue.toString()}`;
    },
  },
  {
    label: 'Date Submitted',
    key: 'createdAt',
  },
];

const IDTypes = [
  {
    label: 'MSISDN',
    value: 'MSISDN',
  },
  {
    label: 'EMAIL',
    value: 'EMAIL',
  },
  {
    label: 'PERSONAL_ID',
    value: 'PERSONAL_ID',
  },
  {
    label: 'BUSINESS',
    value: 'BUSINESS',
  },
  {
    label: 'DEVICE',
    value: 'DEVICE',
  },
  {
    label: 'ACCOUNT_ID',
    value: 'ACCOUNT_ID',
  },
  {
    label: 'IBAN',
    value: 'IBAN',
  },
  {
    label: 'ALIAS',
    value: 'ALIAS',
  },
];

const TransferStateTypes = [
  {
    label: 'ABORTED',
    value: 'ABORTED',
  },
  {
    label: 'COMMITTED',
    value: 'COMMITTED',
  },
  {
    label: 'RESERVED',
    value: 'RESERVED',
  },
  {
    label: 'SETTLED',
    value: 'SETTLED',
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
  transfersError: string | null;
  filtersModel: TransfersFilter;
  onClearFiltersClick: () => void;
  onTransferSelect: (transfer: Transfer) => void;
  onFilterChange: (field: string, value: FilterChangeValue | string) => void;
}

const Filters: FC<TransferFiltersProps> = ({
  model,
  onFilterChange,
  onClearFiltersClick,
  onFindTransfersClick,
}) => {
  return (
    <div className="transfers__filters">
      <div className="transfers__filters__filter-row">
        <TextField
          className="transfers__filters__textfield"
          placeholder="Payer FSPID"
          size="small"
          value={model?.payerFspid}
          onChange={(value) => onFilterChange('payerFspid', value)}
        />
        <Select
          className="transfers__filters__select"
          size="small"
          id="filter_payerIdType"
          placeholder="Payer ID Type"
          options={IDTypes}
          value={model?.payerIdType}
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
          value={model?.payeeFspid}
          onChange={(value) => onFilterChange('payeeFspid', value)}
        />
        <Select
          className="transfers__filters__select"
          size="small"
          id="filter_payeeIdType"
          placeholder="Payee ID Type"
          options={IDTypes}
          value={model?.payeeIdType}
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
        <DatePicker
          className="transfers__filters__date-filter"
          size="small"
          id="filter_date_from"
          format="yyyy-MM-dd'T'HH:mm:ss xxx"
          value={model && model.from ? new Date(model.from).toISOString() : undefined}
          placeholder="From"
          onChange={(value) => onFilterChange('from', fromDate(value))}
          withTime
        />
        <DatePicker
          className="transfers__filters__date-filter"
          size="small"
          id="filter_date_to"
          format="yyyy-MM-dd'T'HH:mm:ss xxx"
          value={model && model.to ? new Date(model.to).toISOString() : undefined}
          placeholder="To"
          onChange={(value) => onFilterChange('to', fromDate(value))}
          withTime
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
          options={TransferStateTypes}
          value={model?.transferState}
          onChange={(value) => onFilterChange('transferState', value as string)}
        />
      </div>
      <div className="transfers__filters__filter-row">
        <Button
          className="transfers__filters__find"
          size="small"
          kind="primary"
          label="Find Transfers"
          onClick={onFindTransfersClick}
        />
        <Button
          noFill
          className="transfers__filters__date-filter"
          size="small"
          kind="danger"
          label="Clear Filters"
          onClick={onClearFiltersClick}
        />
      </div>
    </div>
  );
};

const Transfers: FC<ConnectorProps> = ({
  valueTransfer,
  transfers,
  transfersError,
  filtersModel,
  jsonObject,
  partyObject,
  onClearFiltersClick,
  onTransferSelect,
  onFilterChange,
}) => {
  let content = null;
  const [getTransfers, { loading, error, data }] = useLazyQuery(GET_TRANSFERS_WITH_EVENTS, {
    variables: {
      startDate: filtersModel.from,
      endDate: filtersModel.to,
      currency: filtersModel.currency,
      transferState: filtersModel.transferState,
      payeeDFSPId: filtersModel.payeeFspid,
      payerDFSPId: filtersModel.payerFspid,
      payeeIdType: filtersModel.payerIdType,
      payerIdType: filtersModel.payerIdType,
      payeeIdValue: filtersModel.payeeIdValue,
      payerIdValue: filtersModel.payerIdValue,
    },
  });
  if (error) {
    content = <MessageBox kind="danger">Error fetching transfers: {transfersError}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    content = (
      <Table
        columns={transfersColumns}
        rows={data ? data.transfers : []}
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
    <div className="transfers-tracing-app">
      <Heading size="3">Find Transfers</Heading>
      <Filters
        model={filtersModel}
        onFilterChange={onFilterChange}
        onClearFiltersClick={onClearFiltersClick}
        onFindTransfersClick={getTransfers}
      />
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
  onClearFiltersClick: () => void;
  onFindTransfersClick: () => void;
}

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(
  withMount(Transfers, 'onMount'),
);
