import React, { FC } from 'react';
import { connect } from 'react-redux';
import { ReduxContext } from 'store';
import { Row } from 'antd';
import TransfersByCurrencyChart from './TransfersByCurrencyChart';
import ErrorsByPayeeChart from './ErrorsByPayeeChart';
import ErrorsByPayerChart from './ErrorsByPayerChart';
import ErrorsByErrorCodeChart from './ErrorsByErrorCodeChart';
import TransfersByPayeeChart from './TransfersByPayeeChart';
import TransfersByPayerChart from './TransfersByPayerChart';
import TransferTotalSummary from './TransferTotalSummary';
import ErrorSummary from './ErrorSummary';

const stateProps = () => ({});

const dispatchProps = () => ({});

interface ConnectorProps {}

const Dashboard: FC<ConnectorProps> = () => {
  return (
    <div>
      <Row style={{ marginBottom: 8 }}>
        <TransferTotalSummary />
        <TransfersByCurrencyChart />
        <TransfersByPayerChart />
        <TransfersByPayeeChart />
      </Row>
      <Row style={{ marginBottom: 8 }}>
        <ErrorSummary />
        <ErrorsByErrorCodeChart />
        <ErrorsByPayerChart />
        <ErrorsByPayeeChart />
      </Row>
    </div>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(Dashboard);
