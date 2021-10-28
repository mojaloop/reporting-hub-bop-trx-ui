import React from 'react';
import Transfers from './Transfers';
import 'antd/dist/antd.css';
import './index.scss';

function App() {
  return (
    <div className="transfers-tracing-app">
      <Transfers />
    </div>
  );
}

export { App };
export default App;
