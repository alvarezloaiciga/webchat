// @flow
import React from 'react';
import {supportsSVG} from 'Common/Utils';
import quiqOptions, {getStyle} from 'Common/QuiqOptions';
import {lighten} from 'polished';

export type TypingIndicatorProps = {};

const {colors} = quiqOptions;

const AgentTypingMessage = () => {
  const xScale = 1;
  const yScale = 1;
  const rScale = 1;
  const width = xScale * 50;
  const height = yScale * 20;
  const r = rScale * (height / 6);

  const drawCircle = (xPos: number, offset: number, id: number) => (
    <g>
      <circle r={r} cx={xPos} cy={height / 2} fill="white">
        <animate
          id={`o${id}`}
          begin={`${offset};o${id + 1}.end`}
          attributeName="r"
          from={r * 0.6}
          to={r * 1.4}
          dur=".6"
        />
      </circle>
      <circle r={r} cx={xPos} cy={height / 2} fill="white">
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

  return supportsSVG() ? (
    <svg
      className="AgentTypingMessage"
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
          <stop offset="0%" stopColor={lighten(0.15, colors.agentMessageBackground)} />
          <stop offset="25%" stopColor={colors.agentMessageBackground} />
          <stop offset="100%" stopColor={lighten(0.15, colors.agentMessageBackground)} />
          <animate attributeName="x1" dur="1.5s" from="-300%" to="100%" repeatCount="indefinite" />
          <animate attributeName="x2" dur="1.5s" from="-100%" to="300%" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <g id="background" fill="url(#flash)">
        <rect x={width / 4} height={height} width={width / 2} />
        <circle r={height / 2} cx={width / 4} cy={height / 2} />
        <circle r={height / 2} cx={width - width / 4} cy={height / 2} />
      </g>
      <g id="foreground">
        {drawCircle(width * 0.3, 0, 0)}
        {drawCircle(width * 0.5, 0.3, 5)}
        {drawCircle(width * 0.7, 0.6, 10)}
      </g>
    </svg>
  ) : (
    <span className="plainText">...</span>
  );
};

export default AgentTypingMessage;
