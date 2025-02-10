import { useQuery } from '@apollo/client';
import { GET_TRANSFER_SUMMARY_BY_PAYER } from 'apollo/query';
import { MessageBox, Spinner } from 'components';
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ReduxContext, State, Dispatch } from 'store';
import { TransferSummary } from 'apollo/types';
import { map, groupBy, sumBy } from 'lodash';
import { FilterChangeValue, TransfersFilter } from '../types';
import { actions } from '../slice';
import * as selectors from '../selectors';
import { RED_CHART_GRADIENT_COLORS, renderActiveShape, renderRedLegend } from './utils';

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

const ErrorsByPayerChart: FC<ConnectorProps> = ({ filtersModel, onFilterChange, onError }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_PAYER, {
    fetchPolicy: 'no-cache',
    variables: {
      startDate: filtersModel.from,
      endDate: filtersModel.to,
    },
  });

  const [activeIndex, setActiveIndex] = useState<number>();

  const onPieEnter = (_pieData: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  let content = null;
  // Check if the Error is a 403
  if (error) {
    const status = (error.networkError as { statusCode?: number })?.statusCode;
    const isForbidden = status === 403;
    onError('ErrorsByPayerChart', error);

    content = (
      <MessageBox kind={isForbidden ? 'default' : 'danger'}>
        {isForbidden ? 'Restricted Access' : `Error fetching transfers: ${error.message}`}
      </MessageBox>
    );
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const groupedSummary = map(
      groupBy(
        data.transferSummary.filter((obj: TransferSummary) => obj.group.errorCode !== null),
        (item: TransferSummary) => item.group.payerDFSP,
      ),
      (groupedItems, payerDFSP) => ({
        payerDFSP,
        count: sumBy(groupedItems, 'count'),
      }),
    );

    const sortedSummary = groupedSummary.sort((a, b) => b.count - a.count);
    const topThree = sortedSummary.slice(0, 3);
    const remainingSummary = {
      payerDFSP: 'Other',
      count: sortedSummary.slice(3).reduce((sum, { count }) => sum + count, 0),
    };

    if (remainingSummary.count > 0) {
      topThree.push(remainingSummary);
    }

    content = (
      <PieChart id="ErrorsByPayerChart" width={300} height={120}>
        <Legend
          id="ErrorsByPayerChartLegend"
          name="Payer"
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
          nameKey="payerDFSP"
          innerRadius={30}
          outerRadius={50}
          blendStroke
          onClick={(value) => {
            if (value.name !== 'Other') {
              onFilterChange('payerFSPId', value.name);
            }
          }}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {topThree.map((_entry, index) => (
            <Cell
              key={_entry.payerDFSP}
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
  ErrorsByPayerChart,
);
