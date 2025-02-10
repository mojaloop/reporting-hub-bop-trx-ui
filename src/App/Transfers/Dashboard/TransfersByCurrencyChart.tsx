import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ReduxContext, State } from 'store';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { GET_TRANSFER_SUMMARY } from 'apollo/query';
import * as selectors from '../selectors';
import { TransfersFilter } from '../types';
import { RED_CHART_GRADIENT_COLORS, renderActiveShape, renderRedLegend } from './utils';

const stateProps = (state: State) => ({
  filtersModel: selectors.getTransfersFilter(state),
});
const dispatchProps = () => ({});
interface ConnectorProps {
  filtersModel: TransfersFilter;
  onError: (component: string, error: any) => void;
}
const TransfersByCurrencyChart: FC<ConnectorProps> = ({ filtersModel, onError }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY, {
    fetchPolicy: 'no-cache',
    variables: {
      startDate: filtersModel.from,
      endDate: filtersModel.to,
    },
  });
  const [activeIndex, setActiveIndex] = useState<number>();
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };
  let content = null;
  if (error) {
    const status = (error.networkError as { statusCode?: number })?.statusCode;

    const isForbidden = status === 403;
    onError('TransfersByCurrencyChart', error);
    content = (
      <MessageBox kind={isForbidden ? 'default' : 'danger'}>
        {isForbidden ? 'Restricted Access' : `Error fetching transfers: ${error.message}`}
      </MessageBox>
    );
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const summary = data.transferSummary
      .filter((obj: TransferSummary) => {
        return obj.errorCode !== null;
      })
      .slice()
      .sort((a: TransferSummary, b: TransferSummary) => b.count - a.count);
    const topThree = summary.slice(0, 3);
    const remainingSummary = {
      errorCode: 'Other',
      count: summary.slice(3).reduce((n: number, { count }: TransferSummary) => n + count, 0),
    };
    if (remainingSummary.count > 0) {
      topThree.push(remainingSummary);
    }
    content = (
      <PieChart id="TransfersByCurrencyChart" width={300} height={120}>
        <Legend
          id="TransfersByCurrencyChartLegend"
          name="Target Error Code"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          width={50}
          height={100}
          iconSize={0}
          content={renderRedLegend}
        />
        <Pie
          data={topThree}
          dataKey="count"
          nameKey="errorCode"
          innerRadius={30}
          outerRadius={50}
          blendStroke
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {topThree.map((_entry: any, index: number) => (
            <Cell
              key={`${_entry.errorCode}`}
              fill={RED_CHART_GRADIENT_COLORS[index % RED_CHART_GRADIENT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(
  TransfersByCurrencyChart,
);
