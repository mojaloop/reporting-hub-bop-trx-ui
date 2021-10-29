import { GET_TRANSFER_SUMMARY } from 'apollo/query';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { ReduxContext } from 'store';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { Statistic, Typography } from 'antd';

const { Text } = Typography;

const stateProps = () => ({});

const dispatchProps = () => ({});

interface ConnectorProps {}

const TransferTotalSummary: FC<ConnectorProps> = () => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY, {
    variables: {},
  });
  let content = null;

  if (error) {
    content = <MessageBox kind="danger">Error fetching transfers: {error.message}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const totalTransfers = data.transferSummary.filter((obj: TransferSummary) => {
      return obj.errorCode === null;
    })[0].count;

    content = (
      <div className="transfer-summary">
        <Statistic
          value={new Intl.NumberFormat('en-GB', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(totalTransfers)}
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
