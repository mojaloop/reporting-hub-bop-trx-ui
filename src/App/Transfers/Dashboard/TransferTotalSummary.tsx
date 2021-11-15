import { GET_TRANSFER_SUMMARY } from 'apollo/query';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Dispatch, ReduxContext, State } from 'store';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { Statistic, Typography } from 'antd';
import { FilterChangeValue, TransfersFilter } from '../types';
import { actions } from '../slice';
import * as selectors from '../selectors';

const { Text } = Typography;

const stateProps = (state: State) => ({
  filtersModel: selectors.getTransfersFilter(state),
});

const dispatchProps = (dispatch: Dispatch) => ({
  onFilterChange: (field: string, value: FilterChangeValue | string) =>
    dispatch(actions.setTransferFinderFilter({ field, value })),
});

interface ConnectorProps {
  filtersModel: TransfersFilter;
  onFilterChange: (field: string, value: FilterChangeValue | string) => void;
}

const TransferTotalSummary: FC<ConnectorProps> = ({ filtersModel }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY, {
    fetchPolicy: 'no-cache',
    variables: {
      startDate: filtersModel.from,
      endDate: filtersModel.to,
    },
  });
  let content = null;

  if (error) {
    content = <MessageBox kind="danger">Error fetching transfers: {error.message}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    let totalTransferCount = 0;
    const totalTransfers = data.transferSummary.filter((obj: TransferSummary) => {
      return obj.errorCode === null;
    });
    if (totalTransfers.length > 0) {
      totalTransferCount = totalTransfers[0].count;
    }
    content = (
      <div className="transfer-summary">
        <Statistic
          value={new Intl.NumberFormat('en-GB', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(totalTransferCount)}
        />
        <Text type="secondary">Total Transfers</Text>
      </div>
    );
  }
  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(
  TransferTotalSummary,
);
