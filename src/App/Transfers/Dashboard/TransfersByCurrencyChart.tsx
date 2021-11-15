import { GET_TRANSFER_SUMMARY_BY_CURRENCY } from 'apollo/query';
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ReduxContext } from 'store';
import { State, Dispatch } from 'store/types';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { FilterChangeValue, TransfersFilter } from '../types';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { GREEN_CHART_GRADIENT_COLORS, renderActiveShape, renderGreenLegend } from './utils';

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

const ByCurrencyChart: FC<ConnectorProps> = ({ filtersModel, onFilterChange }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_CURRENCY, {
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
    content = <MessageBox kind="danger">Error fetching transfers: {error.message}</MessageBox>;
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const summary = data.transferSummary
      .filter((obj: TransferSummary) => {
        return obj.errorCode === null;
      })
      .slice()
      .sort((a: TransferSummary, b: TransferSummary) => b.count - a.count);
    const firstThree = summary.slice(0, 3);
    const remainingSummary = {
      currency: 'Other',
      count: summary.slice(3).reduce((n: number, { count }: TransferSummary) => n + count, 0),
    };
    if (remainingSummary.count > 0) {
      firstThree.push(remainingSummary);
    }

    content = (
      <PieChart id="TransfersByCurrencyChart" width={300} height={120}>
        <Legend
          id="TransfersByCurrencyChartLegend"
          name="By Currency"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          width={50}
          height={100}
          iconSize={0}
          content={renderGreenLegend}
        />
        <Pie
          data={firstThree}
          dataKey="count"
          nameKey="currency"
          innerRadius={30}
          outerRadius={50}
          blendStroke
          onClick={(value) => {
            if (value.name !== 'Other') {
              onFilterChange('currency', value.name);
            }
          }}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {firstThree.map((_entry: any, index: number) => (
            <Cell
              key={`${_entry.currency}`}
              fill={GREEN_CHART_GRADIENT_COLORS[index % GREEN_CHART_GRADIENT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
  return content;
};

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ByCurrencyChart);
