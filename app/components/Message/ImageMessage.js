// @flow

import React from 'react';
import classnames from 'classnames';
import CircularProgressbar from 'react-circular-progressbar';
import type {AttachmentMessage as AttachmentMessageType} from 'Common/types';
import './styles/ImageMessage.scss';

export type ImageMessageProps = {
  message: AttachmentMessageType,
  scrollToBottom: () => void,
};

export type ImageMessageState = {
  imageLoaded: boolean,
  imageWidth?: number,
  imageHeight?: number,
};

export class ImageMessage extends React.Component<ImageMessageProps, ImageMessageState> {
  props: ImageMessageProps;
  state: ImageMessageState = {
    imageLoaded: false,
  };
  image: ?Image;
  pollingInterval: number;

  componentWillMount() {
    this.loadImage(this.props.message.url);
  }

  componentWillReceiveProps(nextProps: ImageMessageProps) {
    if (nextProps.message.url !== this.props.message.url) {
      // Start loading new image
      this.loadImage(nextProps.message.url);
    }
  }

  loadImage = (url: string) => {
    this.image = new Image();
    this.image.src = url;
    this.setState({imageWidth: undefined, imageHeight: undefined});
    if (this.image && this.image.complete) {
      this.setState({imageLoaded: true}, this.props.scrollToBottom);
    } else {
      this.trackImageLoading();
    }
  };

  handleImageLoad = () => {
    // Clear dimension polling interval, if for some reason we're still trying to find those
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.setState({imageLoaded: true});
    this.image = null;
  };

  loadImageDimensions = () => {
    if (this.image && this.image.naturalHeight && this.image.naturalWidth) {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
      this.setState(
        {
          imageWidth: this.image.naturalWidth,
          imageHeight: this.image.naturalHeight,
        },
        this.props.scrollToBottom,
      );
    }
  };

  trackImageLoading = () => {
    if (!this.image) return;

    // Listen for image load
    this.image.addEventListener('load', this.handleImageLoad);

    // Poll for dimensions
    this.pollingInterval = setInterval(this.loadImageDimensions, 20);
  };

  renderImage = () => {
    if (this.state.imageLoaded) {
      return (
        <a href={this.props.message.url} target="_blank" rel="noopener noreferrer">
          <img src={this.props.message.url} />
        </a>
      );
    }

    if (this.state.imageHeight && this.state.imageWidth) {
      return (
        <canvas
          className="placeholder"
          width={this.state.imageWidth}
          height={this.state.imageHeight}
        />
      );
    }

    return null;
  };

  render() {
    const fromCustomer = this.props.message.authorType === 'Customer';
    const isUploading = this.props.message.status && this.props.message.status === 'pending';

    return (
      <div className={classnames('ImageMessage', {uploading: isUploading, fromCustomer})}>
        {this.renderImage()}
        {isUploading && (
          <CircularProgressbar
            percentage={this.props.message.uploadProgress || 0}
            textForPercentage={() => ''}
          />
        )}
      </div>
    );
  }
}

export default ImageMessage;
