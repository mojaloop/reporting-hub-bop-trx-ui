import { truncate } from 'lodash';
import React from 'react';
import { Sector } from 'recharts';

export const GREEN_CHART_GRADIENT_COLORS = ['#2D662E', '#3B883E', '#4AAA4E', '#808080'];
export const RED_CHART_GRADIENT_COLORS = ['#800C23', '#AB102F', '#F76861', '#808080'];

export const truncateLegend = (value: string) => {
  return <span>{truncate(value, { length: 17 })}</span>;
};

export const renderGreenLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul style={{ listStyleType: 'none' }}>
      {payload.length ? (
        <li>
          <span className="legend-title">{props.name}</span>
        </li>
      ) : (
        <div />
      )}
      {payload.map((entry: any, index: number) => (
        <li
          key={`legend-${props.id}-${entry.value}`}
          style={{ color: GREEN_CHART_GRADIENT_COLORS[index % GREEN_CHART_GRADIENT_COLORS.length] }}
        >
          {truncateLegend(entry.value)}
        </li>
      ))}
    </ul>
  );
};

export const renderRedLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul style={{ listStyleType: 'none' }}>
      {payload.length ? (
        <li>
          <span className="legend-title">{props.name}</span>
        </li>
      ) : (
        <div />
      )}
      {payload.map((entry: any, index: number) => (
        <li
          key={`legend-${props.id}-${entry.value}`}
          style={{ color: RED_CHART_GRADIENT_COLORS[index % RED_CHART_GRADIENT_COLORS.length] }}
        >
          {truncateLegend(entry.value)}
        </li>
      ))}
    </ul>
  );
};

export const renderErrorLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul style={{ listStyleType: 'none' }}>
      {payload.map((entry: any, index: number) => (
        <li
          key={`legend-${JSON.stringify(payload)}`}
          style={{ color: RED_CHART_GRADIENT_COLORS[index % RED_CHART_GRADIENT_COLORS.length] }}
        >
          {truncateLegend(entry.value)}
        </li>
      ))}
    </ul>
  );
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
