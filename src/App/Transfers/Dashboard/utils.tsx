import { truncate } from 'lodash';
import React from 'react';
import { Sector } from 'recharts';

export const BLUE_CHART_GRADIENT_COLORS = ['#2D662E', '#3B883E', '#4AAA4E', '#808080'];
export const RED_CHART_GRADIENT_COLORS = ['#800C23', '#AB102F', '#F76861', '#808080'];

export const truncateLegend = (value: string) => {
  return <span>{truncate(value, { length: 8 })}</span>;
};

export const renderActiveShape = (props: any) => {
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
