import { GET_TRANSFER_SUMMARY_BY_SOURCE_CURRENCY } from 'apollo/query';
import React, { FC, useState, useEffect } from 'react';
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
  onError: (component: string, error: any) => void;
}

const TransfersBySourceCurrencyChart: FC<ConnectorProps> = ({
  filtersModel,
  onFilterChange,
  onError,
}) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_SOURCE_CURRENCY, {
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

  // Ensure onError does not trigger a state update during render
  useEffect(() => {
    if (error) {
      onError('TransfersBySourceCurrencyChart', error);
    }
  }, [error, onError]);

  let content = null;

  if (error) {
    const status = (error.networkError as { statusCode?: number })?.statusCode;
    const isForbidden = status === 403;
    content = (
      <MessageBox kind={isForbidden ? 'default' : 'danger'}>
        {isForbidden ? 'Restricted Access' : `Error fetching transfers: ${error.message}`}
      </MessageBox>
    );
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const groupedSummary = data.transferSummary
      .filter((obj: TransferSummary) => obj.group.errorCode === null)
      .reduce(
        (acc: Record<string, { count: number; sourceAmount: number }>, curr: TransferSummary) => {
          const { sourceCurrency } = curr.group;
          if (!sourceCurrency) return acc;
          if (!acc[sourceCurrency]) {
            acc[sourceCurrency] = { count: 0, sourceAmount: 0 };
          }
          acc[sourceCurrency].count += curr.count;
          acc[sourceCurrency].sourceAmount += curr.sum.sourceAmount;
          return acc;
        },
        {},
      );

    const summaryArray = Object.entries(groupedSummary)
      .map(
        ([sourceCurrency, { count, sourceAmount }]: [
          string,
          { count: number; sourceAmount: number },
        ]) => ({
          sourceCurrency,
          count,
          sourceAmount,
        }),
      )
      .sort((a, b) => b.count - a.count);

    const topThree = summaryArray.slice(0, 3);
    const other = summaryArray.slice(3).reduce(
      (acc, curr) => {
        acc.count += curr.count;
        acc.sourceAmount += curr.sourceAmount;
        return acc;
      },
      { sourceCurrency: 'Other', count: 0, sourceAmount: 0 },
    );

    if (other.count > 0) {
      topThree.push(other);
    }

    content = (
      <PieChart id="TransfersBySourceCurrencyChart" width={300} height={120}>
        <Legend
          id="TransfersBySourceCurrencyChartLegend"
          name="Source Currency"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          width={50}
          height={100}
          iconSize={0}
          content={renderGreenLegend}
        />
        <Pie
          data={topThree}
          dataKey="sourceAmount"
          nameKey="sourceCurrency"
          innerRadius={30}
          outerRadius={50}
          blendStroke
          onClick={(value) => {
            if (value.name !== 'Other') {
              onFilterChange('sourceCurrency', value.name);
            }
          }}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {topThree.map((_entry: any, index: number) => (
            <Cell
              key={`${_entry.sourceCurrency}`}
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

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(
  TransfersBySourceCurrencyChart,
);
