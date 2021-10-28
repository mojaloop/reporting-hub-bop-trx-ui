import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { MessageBox, Spinner } from 'components';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ReduxContext } from 'store';
import { GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP } from '../../../apollo/query';

const COLORS = ['#2D662E', '#3B883E', '#4AAA4E', '#808080'];

const stateProps = () => ({});

const dispatchProps = () => ({});

interface ConnectorProps {}

const ByPayeeChart: FC<ConnectorProps> = () => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP, {
    variables: {},
  });
  let content = null;
  if (error) {
    content = <MessageBox kind="danger">Error fetching transfers: {error.message}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const summary = data.transferSummary
      .slice()
      .sort((a: TransferSummary, b: TransferSummary) => b.count - a.count);
    const firstThree = summary.slice(0, 3);
    const remainingSummary = {
      payeeDFSP: 'Other',
      count: summary.slice(3).reduce((n: number, { count }: TransferSummary) => n + count, 0),
    };
    if (remainingSummary.count > 0) {
      firstThree.push(remainingSummary);
    }

    content = (
      <PieChart width={300} height={120}>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          width={50}
          height={100}
          iconSize={0}
        />
        <Pie
          data={firstThree}
          dataKey="count"
          nameKey="payeeDFSP"
          innerRadius={30}
          outerRadius={50}
          blendStroke
        >
          {firstThree.map((_entry: any, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ByPayeeChart);
