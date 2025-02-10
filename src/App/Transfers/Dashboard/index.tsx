import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { ReduxContext } from 'store';
import { Row } from 'antd';
import ErrorsByPayeeChart from './ErrorsByPayeeChart';
import ErrorsByPayerChart from './ErrorsByPayerChart';
import TransfersByPayeeChart from './TransfersByPayeeChart';
import TransfersByPayerChart from './TransfersByPayerChart';
import TransferTotalSummary from './TransferTotalSummary';
import TransfersBySourceCurrencyChart from './TransfersBySourceCurrencyChart';
import TransfersByTargetCurrencyChart from './TransfersByTargetCurrencyChart';
import ErrorSummary from './ErrorSummary';
import ErrorsByErrorCodeChart from './ErrorsByErrorCodeChart';
import ErrorMessage from './ErrorMessage';
import { TransfersFilter } from '../types';

const stateProps = () => ({});
const dispatchProps = () => ({});

interface ConnectorProps {
  filtersModel: TransfersFilter;
  onError?: (component: string, error: any) => void;
}

const Dashboard: FC<ConnectorProps> = () => {
  const [errorComponent, setErrorComponent] = useState<string | null>(null);
  // Error handling function
  const handleError = (component: string, error: any) => {
    // Check for a 403 error or any other error
    if (error?.response?.status === 403) {
      setErrorComponent('You do not have permission to view this data.');
    } else {
      setErrorComponent(`${component}: ${error.message}`);
    }
  };

  // If an error is present, display the error message and do not render the charts
  if (errorComponent) {
    return <ErrorMessage message={errorComponent} />;
  }

  return (
    <div>
      <Row style={{ marginBottom: 10, gap: 20 }}>
        <TransferTotalSummary onError={handleError} />
        <TransfersBySourceCurrencyChart onError={handleError} />
        <TransfersByTargetCurrencyChart onError={handleError} />
        <div style={{ marginLeft: '55px' }}>
          <TransfersByPayerChart onError={handleError} />
        </div>
        <TransfersByPayeeChart onError={handleError} />
      </Row>
      <Row style={{ marginBottom: 30, gap: 20 }}>
        <ErrorSummary onError={handleError} />
        <ErrorsByErrorCodeChart onError={handleError} />
        <ErrorsByPayerChart onError={handleError} />
        <div style={{ marginLeft: '55px' }}>
          <ErrorsByPayeeChart onError={handleError} />
        </div>
      </Row>
    </div>
  );
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(Dashboard);
