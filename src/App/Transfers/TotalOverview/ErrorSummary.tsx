import { GET_TRANSFER_SUMMARY } from 'apollo/query';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { ReduxContext } from 'store';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { Statistic, Typography } from 'antd';
import { round } from 'lodash';
import { TransferSummary } from '../../../apollo/types';

const { Title, Text } = Typography;

const stateProps = () => ({});

const dispatchProps = () => ({});

interface ConnectorProps {}

const ErrorSummary: FC<ConnectorProps> = () => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY, {
    variables: {},
  });
  let content = null;

  if (error) {
    content = <MessageBox kind="danger">Error fetching transfers: {error.message}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const totalErrors = data.transferSummary
      .filter((obj: TransferSummary) => {
        return obj.errorCode !== null;
      })
      .reduce((n: number, { count }: TransferSummary) => n + count, 0);
    const totalTransfers = data.transferSummary.filter((obj: TransferSummary) => {
      return obj.errorCode == null;
    })[0].count;

    content = (
      <div className="transfer-summary">
        <Statistic value={totalErrors} />
        <Title level={5}>{`${round(totalErrors / totalTransfers, 2)}%`}</Title>
        <Text type="secondary">Total Errors</Text>
      </div>
    );
  }
  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ErrorSummary);
