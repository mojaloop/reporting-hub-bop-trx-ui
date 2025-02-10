import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { MessageBox, Spinner } from 'components';
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ReduxContext, State, Dispatch } from 'store';
import { GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP } from 'apollo/query';
import { map, groupBy, sumBy } from 'lodash';
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

const TransfersByPayeeChart: FC<ConnectorProps> = ({ filtersModel, onFilterChange, onError }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP, {
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
  if (error) {
    const status = (error.networkError as { statusCode?: number })?.statusCode;
    onError('TransferByPayeeChart', error);

    const isForbidden = status === 403;
    content = (
      <MessageBox kind={isForbidden ? 'default' : 'danger'}>
        {isForbidden ? 'Restricted Access' : `Error fetching transfers: ${error.message}`}
      </MessageBox>
    );
  } else if (loading) {
    content = <Spinner center />;
  } else {
    const prunedSummary = data.transferSummary.filter(
      (obj: TransferSummary) => obj.group.errorCode === null && obj.sum.targetAmount > 0,
    );

    const summary = map(
      groupBy(prunedSummary, (ts: any) => ts.group.payeeDFSP),
      (ts: any, payeeDFSP: string) => ({
        payeeDFSP,
        targetAmount: sumBy(ts, (item: any) => item.sum.targetAmount),
      }),
    ).sort((a: any, b: any) => b.targetAmount - a.targetAmount);

    const topThree = summary.slice(0, 3);
    const remainingSummary = {
      payeeDFSP: 'Other',
      targetAmount: summary
        .slice(3)
        .reduce((n: number, { targetAmount }: any) => n + targetAmount, 0),
    };
    if (remainingSummary.targetAmount > 0) {
      topThree.push(remainingSummary);
    }

    content = (
      <PieChart id="TransfersByPayeeChart" width={300} height={120}>
        <Legend
          id="TransfersByPayeeChartLegend"
          name="Payee DFSP"
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
          nameKey="payeeDFSP"
          innerRadius={30}
          outerRadius={50}
          blendStroke
          onClick={(value) => {
            if (value.name !== 'Other') {
              onFilterChange('payeeFSPId', value.name);
            }
          }}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {topThree.map((_entry: any, index: number) => (
            <Cell
              key={`${_entry.payeeDFSP}`}
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
  TransfersByPayeeChart,
);
