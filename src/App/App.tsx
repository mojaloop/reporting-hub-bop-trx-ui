import React from 'react';
import 'antd/dist/antd.css';
import './index.scss';
import { Switch, Route } from 'react-router-dom';
import { Column, Heading, Row } from 'components';
import { ShieldExclamation } from 'react-bootstrap-icons';
import { useBasePath } from 'App/hooks';
import Transfers from './Transfers';

function ForbiddenRoute() {
  return (
    <Column style={{ height: '100%' }} align="center center">
      <Heading size="3">Forbidden 403</Heading>
      <br />
      <br />

      <Row align="center center">
        <ShieldExclamation size={80} fill="#999" />
        <Heading size="4" style={{ color: '#999', paddingLeft: '40px' }}>
          You do not have access to this resource
        </Heading>
      </Row>
      <br />
      <br />
    </Column>
  );
}

function App() {
  const basePath = useBasePath();
  return (
    <div className="transfers-tracing-app">
      <Switch>
        <Route exact path={`${basePath}/`} component={Transfers} />
        <Route path={`${basePath}/403`} component={ForbiddenRoute} />
      </Switch>
    </div>
  );
}

export { App };
export default App;
