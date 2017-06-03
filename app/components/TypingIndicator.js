// @flow
import React from 'react';
import {supportsSVG} from 'utils/utils';
import './styles/TypingIndicator.scss';

export type TypingIndicatorProps = {
  color?: 'green' | 'blue',
  duration?: number,
  yScale?: number,
  xScale?: number,
};

const TypingIndicator = ({
  color = 'green',
  duration = 1,
  xScale = 1,
  yScale = 1,
}: TypingIndicatorProps) => {
  const getColor = () => {
    switch (color) {
      case 'blue':
        return '#a6daec';
      case 'green':
      default:
        return '#59ad5d';
    }
  };
  const width = xScale * 24;
  const height = yScale * 30;

  const opacityLayer = (begin: string) =>
    <animate
      attributeName="opacity"
      attributeType="XML"
      values="0.2; 1; .2"
      begin={begin}
      dur={`${duration}s`}
      repeatCount="indefinite"
    />;

  const heightLayer = (begin: string) => {
    const yStart = 10 * yScale;
    const yEnd = 20 * yScale;

    return (
      <animate
        attributeName="height"
        attributeType="XML"
        values={`${yStart}; ${yEnd}; ${yStart}`}
        begin={begin}
        dur={`${duration}s`}
        repeatCount="indefinite"
      />
    );
  };

  const yLayer = (begin: string) => {
    const yStart = 10 * yScale;
    const yEnd = 5 * yScale;

    return (
      <animate
        attributeName="y"
        attributeType="XML"
        values={`${yStart}; ${yEnd}; ${yStart}`}
        begin={begin}
        dur={`${duration}s`}
        repeatCount="indefinite"
      />
    );
  };

  const rect = (x: number, begin: string) => {
    const rectHeight = 10 * yScale;
    const rectWidth = 4 * xScale;

    return (
      <rect
        x={x * xScale}
        y={rectHeight}
        width={rectWidth}
        height={rectHeight}
        fill={getColor()}
        opacity="0.2"
      >
        {opacityLayer(begin)}
        {heightLayer(begin)}
        {yLayer(begin)}
      </rect>
    );
  };

  return supportsSVG()
    ? <svg
        className="TypingIndicator"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        xmlSpace="preserve"
      >
        ...
        {rect(0, `${0 * duration}s`)}
        {rect(8, `${0.3 * duration}s`)}
        {rect(16, `${0.6 * duration}s`)}
      </svg>
    : <span className="plainText">...</span>;
};

export default TypingIndicator;
