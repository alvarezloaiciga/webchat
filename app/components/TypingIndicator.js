// @flow
import React from 'react';
import {getDisplayString} from 'core-ui/services/i18nService';
import type {IntlMessage} from 'types';

export type TypingIndicatorProps = {
  title?: string | IntlMessage,
  xScale: number,
  yScale: number,
  radius: {
    offset: number,
    scale: number,
    spacing: number,
  },
  svgStyle?: Object,
  circleStyle?: Object, // eslint-disable-line react/no-unused-prop-types
  gradientColor: {
    foreground: string,
    background: string,
  },
};

const TypingIndicator = (props: TypingIndicatorProps) => {
  const width = props.xScale * 50;
  const height = props.yScale * 20;
  const r = props.radius.scale * (height / 6);

  const drawCircle = (xPos: number, offset: number, id: number) => (
    <g>
      <circle style={props.circleStyle} r={r} cx={xPos} cy={height / 2} fill="white">
        <animate
          id={`o${id}`}
          begin={`${offset};o${id + 1}.end`}
          attributeName="r"
          from={r * 0.6}
          to={r * 1.4}
          dur=".6"
        />
      </circle>
      <circle style={props.circleStyle} r={r} cx={xPos} cy={height / 2} fill="white">
        <animate
          id={`o${id + 1}`}
          begin={`o${id}.end`}
          attributeName="r"
          from={r * 1.4}
          to={r * 0.6}
          dur=".6"
        />
      </circle>
    </g>
  );

  return (
    <svg
      className="TypingIndicator"
      style={props.svgStyle}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
      xmlSpace="preserve"
    >
      <defs>
        <linearGradient id="flash" x1="-300%" x2="-100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={props.gradientColor.background} />
          <stop offset="25%" stopColor={props.gradientColor.foreground} />
          <stop offset="100%" stopColor={props.gradientColor.background} />
          <animate attributeName="x1" dur="1.5s" from="-300%" to="100%" repeatCount="indefinite" />
          <animate attributeName="x2" dur="1.5s" from="-100%" to="300%" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <g>
        {props.title && <title>{getDisplayString(props.title)}</title>}
        <g id="background" fill="url(#flash)">
          <rect x={width / 4} height={height} width={width / 2} />
          <circle r={height / 2} cx={width / 4} cy={height / 2} />
          <circle r={height / 2} cx={width - width / 4} cy={height / 2} />
        </g>
        <g id="foreground">
          {drawCircle(width * props.radius.offset, 0, 0)}
          {drawCircle(width * (props.radius.offset + props.radius.spacing), props.radius.offset, 5)}
          {drawCircle(
            width * (props.radius.offset + props.radius.spacing * 2),
            props.radius.offset * 2,
            10,
          )}
        </g>
      </g>
    </svg>
  );
};

TypingIndicator.defaultProps = {
  xScale: 1,
  yScale: 1,
  radius: {
    scale: 1,
    offset: 0.3,
    spacing: 0.2,
  },
  gradientColor: {
    foreground: '#2199e8',
    background: '#66b9ef',
  },
};

export default TypingIndicator;
