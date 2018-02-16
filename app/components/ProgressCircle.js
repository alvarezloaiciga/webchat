// @flow

import React from 'react';
import './styles/ProgressCircle.scss';

export type ProgressBarProps = {
  percentage: number,
  size: number,
  progressColor: string,
  trackColor: string,
  progressWidth: number,
  trackWidth: number,
};

export type ProgressBarState = {
  currentPercentage: number,
  targetPercentage: number,
};

const circleTop = Math.PI / -2;
const circumference = 2 * Math.PI;

export class ProgressCircle extends React.Component<ProgressBarProps, ProgressBarState> {
  static defaultProps = {
    progressWidth: 8,
    trackWidth: 8,
    progressColor: '#fff',
    trackColor: 'rgba(128, 128, 128, 0.5)',
    size: 50,
  };

  canvas: HTMLCanvasElement;
  targetPercentage: number;
  currentPercentage: number = 0;
  origin: number;
  radius: number;
  animating: boolean = false;

  constructor(props: ProgressBarProps) {
    super(props);
    this.targetPercentage = props.percentage;
    this.origin = props.size / 2;
    this.radius = Math.max(
      (props.size - 2 * Math.max(props.progressWidth, props.trackWidth)) / 2,
      0,
    );
  }

  componentWillReceiveProps(newProps: ProgressBarProps) {
    this.targetPercentage = newProps.percentage;
    this.origin = newProps.size / 2;
    this.radius = Math.max(
      (newProps.size - 2 * Math.max(newProps.progressWidth, newProps.trackWidth)) / 2,
      0,
    );
    if (!this.animating) {
      this.animate(null, true);
    }
  }

  componentDidMount() {
    this.animate();
  }

  drawTrack = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = this.props.trackWidth;
    ctx.strokeStyle = this.props.trackColor;
    ctx.beginPath();
    ctx.arc(this.origin, this.origin, this.radius, 0, 2 * Math.PI, false);
    ctx.stroke();
  };

  drawProgress = (ctx: CanvasRenderingContext2D, toRadian: number) => {
    ctx.lineWidth = this.props.progressWidth;
    ctx.strokeStyle = this.props.progressColor;
    ctx.beginPath();
    ctx.arc(this.origin, this.origin, this.radius, circleTop, toRadian, false);
    ctx.stroke();
  };

  animate = (highResTimestamp: ?number, forceDraw: boolean = false) => {
    // Bail out if we're at the target percentage and we don't want to force drawing
    if (!forceDraw && this.currentPercentage === this.targetPercentage) {
      this.animating = false;
      return;
    }

    this.animating = true;

    const ctx = this.canvas && this.canvas.getContext('2d');

    // Bail out if ctx is null--ex. device can't support canvas (extremely unlikely)
    if (!ctx) {
      return;
    }

    // Bump to next percentage
    if (this.targetPercentage !== this.currentPercentage) {
      this.currentPercentage =
        this.targetPercentage > this.currentPercentage
          ? this.currentPercentage + 1
          : this.currentPercentage - 1;
    }

    const nextRadian = this.currentPercentage / 100 * circumference + circleTop;

    // Clear off the canvas
    ctx.clearRect(0, 0, 100, 100);

    // Draw track
    this.drawTrack(ctx);

    // Draw progress
    this.drawProgress(ctx, nextRadian);

    // Recursively animate until end
    requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <canvas
        ref={n => {
          if (n) this.canvas = n;
        }}
        width={this.props.size}
        height={this.props.size}
      />
    );
  }

  /*return (
    <div className="ProgressBar"
      style={{
        height: props.width ? `${props.width}px` : '10px',
      }}
    >
      <div className="track"
        style={{
          backgroundColor: props.trackColor,
        }}
      />
      <div className="progressBar"
        style={{
          width: `${Math.max(0, Math.min(props.percentage, 100))}%`,
          backgroundColor: props.progressColor,
        }}
      />
    </div>
  );*/
}

export default ProgressCircle;
