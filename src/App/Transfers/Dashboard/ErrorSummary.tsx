import { GET_TRANSFER_SUMMARY } from 'apollo/query';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Dispatch, ReduxContext, State } from 'store';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { Statistic, Typography } from 'antd';
import { round } from 'lodash';
import { TransferSummary } from 'apollo/types';
import { FilterChangeValue, TransfersFilter } from '../types';
import { actions } from '../slice';
import * as selectors from '../selectors';

const { Title, Text } = Typography;

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

const ErrorSummary: FC<ConnectorProps> = ({ filtersModel }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY, {
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
    const totalErrorCount = data.transferSummary
      .filter((obj: TransferSummary) => {
        return obj.errorCode !== null;
      })
      .reduce((n: number, { count }: TransferSummary) => n + count, 0);

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
          }).format(totalErrorCount)}
        />
        <Title level={5}>{`${round((totalErrorCount / totalTransferCount) * 100, 2)}%`}</Title>
        <Text type="secondary">Total Errors</Text>
      </div>
    );
  }
  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ErrorSummary);
