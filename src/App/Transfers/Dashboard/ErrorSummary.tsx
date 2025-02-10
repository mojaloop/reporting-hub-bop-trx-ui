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
  onError: (component: string, error: any) => void;
}

const ErrorSummary: FC<ConnectorProps> = ({ filtersModel, onError }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY, {
    fetchPolicy: 'no-cache',
    variables: {
      startDate: filtersModel.from,
      endDate: filtersModel.to,
    },
  });

  let content = null;

  if (error) {
    const status = (error.networkError as { statusCode?: number })?.statusCode;
    onError('ErrorSummaryChart', error);
    const isForbidden = status === 403;
    content = (
      <MessageBox kind={isForbidden ? 'default' : 'danger'}>
        {isForbidden ? 'Restricted Access' : `Error fetching transfers: ${error.message}`}
      </MessageBox>
    );
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const totalTransactionCount = data.transferSummary.reduce(
      (total: number, { count }: TransferSummary) => total + count,
      0,
    );
    const totalErrorCount = data.transferSummary
      .filter((obj: TransferSummary) => obj.group.errorCode !== null)
      .reduce((total: number, { count }: TransferSummary) => total + count, 0);
    const errorPercentage =
      totalTransactionCount > 0 ? (totalErrorCount / totalTransactionCount) * 100 : 0;

    content = (
      <div className="transfer-summary">
        <Statistic
          value={new Intl.NumberFormat('en-GB', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(totalErrorCount)}
        />
        <Title level={5} style={{ color: errorPercentage > 50 ? 'red' : 'green' }}>
          {round(errorPercentage, 2)}%
        </Title>
        <Text type="secondary">Total Errors</Text>
      </div>
    );
  }

  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ErrorSummary);
