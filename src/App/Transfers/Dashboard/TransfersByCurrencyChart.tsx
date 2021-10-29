import { GET_TRANSFER_SUMMARY_BY_CURRENCY } from 'apollo/query';
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Legend, Pie, PieChart, Sector, Tooltip } from 'recharts';
import { ReduxContext } from 'store';
import { State, Dispatch } from 'store/types';
import { MessageBox, Spinner } from 'components';
import { useQuery } from '@apollo/client';
import { TransferSummary } from 'apollo/types';
import { truncate } from 'lodash';
import { FilterChangeValue, TransfersFilter } from '../types';
import { actions } from '../slice';
import * as selectors from '../selectors';

const COLORS = ['#2D662E', '#3B883E', '#4AAA4E', '#808080'];

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

const truncateLegend = (value: string) => {
  return <span>{truncate(value, { length: 8 })}</span>;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const ByCurrencyChart: FC<ConnectorProps> = ({ filtersModel, onFilterChange }) => {
  const { loading, error, data } = useQuery(GET_TRANSFER_SUMMARY_BY_CURRENCY, {
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
      <PieChart width={300} height={120}>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          width={50}
          height={100}
          iconSize={0}
          formatter={truncateLegend}
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

export default connect(stateProps, dispatchProps, null, { context: ReduxContext })(ByCurrencyChart);
