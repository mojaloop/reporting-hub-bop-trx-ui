import { GET_TRANSFER_SUMMARY_BY_TARGET_CURRENCY } from 'apollo/query';
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
  onError: (component: string, error: any) => void;
}

const TransfersByTargetCurrencyChart: FC<ConnectorProps> = ({
  filtersModel,
  onFilterChange,
  onError,
}) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_TARGET_CURRENCY, {
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
    onError('TransfersByTargetCurrencyChart', error);
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
        (acc: Record<string, { count: number; targetAmount: number }>, curr: TransferSummary) => {
          const { targetCurrency } = curr.group;
          if (!targetCurrency) return acc;
          if (!acc[targetCurrency]) {
            acc[targetCurrency] = { count: 0, targetAmount: 0 };
          }
          acc[targetCurrency].count += curr.count;
          acc[targetCurrency].targetAmount += curr.sum.targetAmount;
          return acc;
        },
        {},
      );

    const summaryArray = Object.entries(groupedSummary)
      .map(
        ([targetCurrency, { count, targetAmount }]: [
          string,
          { count: number; targetAmount: number },
        ]) => ({
          targetCurrency,
          count,
          targetAmount,
        }),
      )
      .sort((a, b) => b.count - a.count);

    const topThree = summaryArray.slice(0, 3);
    const other = summaryArray.slice(3).reduce(
      (acc, curr) => {
        acc.count += curr.count;
        acc.targetAmount += curr.targetAmount;
        return acc;
      },
      { targetCurrency: 'Other', count: 0, targetAmount: 0 },
    );

    if (other.count > 0) {
      topThree.push(other);
    }

    content = (
      <PieChart id="TransfersByTargetCurrencyChart" width={300} height={120}>
        <Legend
          id="TransfersByTargetCurrencyChartLegend"
          name="Target Currency"
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
          dataKey="targetAmount"
          nameKey="targetCurrency"
          innerRadius={30}
          outerRadius={50}
          blendStroke
          onClick={(value) => {
            if (value.name !== 'Other') {
              onFilterChange('targetCurrency', value.name);
            }
          }}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {topThree.map((_entry: any, index: number) => (
            <Cell
              key={`${_entry.targetCurrency}`}
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
  TransfersByTargetCurrencyChart,
);
