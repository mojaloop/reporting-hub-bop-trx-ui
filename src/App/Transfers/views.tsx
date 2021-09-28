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
import { TransfersFilter, FilterChangeValue, Transfer, TransferDetail } from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import './Transfers.scss';
import TransferDetailsModal from './TransferDetails';

const transfersColumns = [
  {
    label: 'Transfer ID',
    key: 'id',
  },
  {
    label: 'Type',
    key: 'type',
  },
  {
    label: 'Timestamp',
    key: 'id',
    func: (value: string, item: Transfer) => `${item.transferTimestamp || item.quoteTimestamp}`,
  },
  {
    label: 'Payer FSPID',
    key: 'payerFspid',
  },
  {
    label: 'Payee FSPID',
    key: 'payeeFspid',
  },
  {
    label: 'Amount',
    key: 'amount',
    func: (value: string, item: Transfer) => `${item.amount}`,
  },
  {
    label: 'Currency',
    key: 'currency',
    func: (value: string, item: Transfer) => `${item.currency}`,
  },
  {
    label: 'Status',
    key: 'status',
  },
  {
    label: 'Payer Acct ID',
    key: 'id',
    func: (value: string, item: Transfer) => `${item.payerParty.idType} ${item.payerParty.idValue}`,
  },
  {
    label: 'Payee Acct ID',
    key: 'id',
    func: (value: string, item: Transfer) => `${item.payeeParty.idType} ${item.payeeParty.idValue}`,
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

function fromDate(value: Date | undefined): string | undefined {
  if (value) {
    return value.toISOString();
  }
  return value;
}

const stateProps = (state: State) => ({
  valueTransfer: selectors.getSelectedTransfer(state),
  transfers: selectors.getTransfers(state),
  transfersError: selectors.getTransfersError(state),
  isTransfersPending: selectors.getIsTransfersPending(state),
  filtersModel: selectors.getTransfersFilter(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onFindTransfersClick: () => dispatch(actions.requestTransfers()),
  onClearFiltersClick: () => dispatch(actions.clearTransferFinderFilters()),
  onTransferSelect: (transfer: Transfer) => dispatch(actions.selectTransfer(transfer)),
  onFilterChange: (field: string, value: FilterChangeValue | string) =>
    dispatch(actions.setTransferFinderFilter({ field, value })),
});

interface ConnectorProps {
  valueTransfer: TransferDetail | undefined;
  transfers: Transfer[];
  transfersError: string | null;
  isTransfersPending: boolean;
  filtersModel: TransfersFilter;
  onFindTransfersClick: () => void;
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
          placeholder="Transfer ID"
          size="small"
          onChange={(value) => onFilterChange('transferId', value)}
        />
      </div>
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
  isTransfersPending,
  filtersModel,
  onFindTransfersClick,
  onClearFiltersClick,
  onTransferSelect,
  onFilterChange,
}) => {
  let content = null;
  if (transfersError) {
    content = <MessageBox kind="danger">Error fetching transfers: {transfersError}</MessageBox>;
  } else if (isTransfersPending) {
    content = <Spinner center />;
  } else {
    /*
          onSelect={onTransferSelect}
          sortColumn="D"
          sortAsc={false}

        //valueTransfer && <TransferDetails />
    */
    content = (
      <Table
        columns={transfersColumns}
        rows={transfers}
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

  return (
    <div className="transfers-tracing-app">
      <Heading size="3">Find Transfers</Heading>
      <Filters
        model={filtersModel}
        onFilterChange={onFilterChange}
        onClearFiltersClick={onClearFiltersClick}
        onFindTransfersClick={onFindTransfersClick}
      />
      {warning}
      {content}
      {detailModal}
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
