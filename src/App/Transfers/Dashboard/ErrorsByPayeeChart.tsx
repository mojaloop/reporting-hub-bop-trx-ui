import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { MessageBox, Spinner } from 'components';
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { ReduxContext, State, Dispatch } from 'store';
import { GET_TRANSFER_SUMMARY_BY_PAYEE } from 'apollo/query';
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
}

const ByPayeeChart: FC<ConnectorProps> = ({ filtersModel, onFilterChange }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_PAYEE, {
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
    // check if error is a 403
    const status = error.networkError?.statusCode;
    const isForbidden = status === 403;
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
        (item: TransferSummary) => item.group.payeeDFSP,
      ),
      (groupedItems, payeeDFSP) => ({
        payeeDFSP,
        count: sumBy(groupedItems, 'count'),
      }),
    );

    const sortedSummary = groupedSummary.sort((a, b) => b.count - a.count);
    const topThree = sortedSummary.slice(0, 3);
    const remainingSummary = {
      payeeDFSP: 'Other',
      count: sortedSummary.slice(3).reduce((sum, { count }) => sum + count, 0),
    };

    if (remainingSummary.count > 0) {
      topThree.push(remainingSummary);
    }

    content = (
      <PieChart id="ErrorsByPayeeChart" width={300} height={120}>
        <Legend
          id="ErrorsByPayeeChartLegend"
          name="Payee"
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

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ByPayeeChart);
