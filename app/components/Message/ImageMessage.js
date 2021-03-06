// @flow

import React from 'react';
import classnames from 'classnames';
import ProgressCircle from '../ProgressCircle';
import type {AttachmentMessage as AttachmentMessageType} from 'Common/types';
import {css} from 'react-emotion';
import {messageEnter, fadeIn} from 'animations';

export type ImageMessageProps = {
  message: AttachmentMessageType,
  scrollToBottom: () => void,
};

export type ImageMessageState = {
  imageLoaded: boolean,
  imageWidth: number,
  imageHeight: number,
};

const ImageMessageStyle = css`
  max-width: 100%;
  flex: 0 1 auto;
  display: inline-block;
  text-align: left;
  animation: 0.2s 1 ${messageEnter};
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  background-color: rgb(223, 223, 227);

  .placeholder {
    display: block;
    max-width: 100%;
    max-height: 300px;
  }

  img,
  .placeholder {
    display: block;
    border-radius: 5px;
    max-width: 100%;
    width: auto;
    height: auto;
    max-height: 300px;
    transition: filter 0.5s, transform 0.5s;
    animation: 0.2s 1 ${fadeIn};
  }

  /* Disable image border in IE10 */
  a img {
    border: 0;
  }

  &.fromCustomer {
    align-self: flex-end;
  }

  &.uploading {
    img {
      transform: scale(1.1);
      filter: blur(10px);
    }
  }

  .progress {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

export class ImageMessage extends React.Component<ImageMessageProps, ImageMessageState> {
  props: ImageMessageProps;
  state: ImageMessageState = {
    imageLoaded: false,
    imageHeight: 0,
    imageWidth: 0,
  };
  image: ?Image;
  pollingInterval: IntervalID;

  componentWillMount() {
    this.loadImage(this.props.message.localBlobUrl || this.props.message.url);
  }

  componentWillReceiveProps(nextProps: ImageMessageProps) {
    // Start loading new image if one of the sources changed
    if (
      nextProps.message.localBlobUrl &&
      nextProps.message.localBlobUrl !== this.props.message.localBlobUrl
    ) {
      this.loadImage(nextProps.message.localBlobUrl);
    } else if (
      !nextProps.message.localBlobUrl &&
      nextProps.message.url &&
      nextProps.message.url !== this.props.message.url
    ) {
      this.loadImage(nextProps.message.url);
    }
  }

  componentDidUpdate(prevProps: ImageMessageProps, prevState: ImageMessageState) {
    if (this.state.imageHeight && !prevState.imageHeight) {
      this.props.scrollToBottom();
    }
  }

  loadImage = (url: string) => {
    this.setState({imageLoaded: false});
    this.image = new Image();
    this.image.src = url;
    if (this.image.complete) {
      this.handleImageLoad();
    } else {
      // Listen for image load
      this.image.addEventListener('load', this.handleImageLoad);

      // Poll for dimensions
      this.pollingInterval = setInterval(this.loadImageDimensions, 20);
    }
  };

  handleImageLoad = () => {
    // Clear dimension polling interval, if for some reason we're still trying to find those
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Ensure image dimensions have been loaded
    // Catches case where image is immediately complete, and loadImageDimensions() is not called before this function
    if (!this.state.imageHeight || !this.state.imageWidth) {
      this.loadImageDimensions();
    }

    this.setState({imageLoaded: true});
    this.image = null;
  };

  loadImageDimensions = () => {
    if (this.image && this.image.naturalHeight && this.image.naturalWidth) {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
      this.setState({
        imageWidth: this.image.naturalWidth,
        imageHeight: this.image.naturalHeight,
      });
    }
  };

  renderImage = () => {
    if (this.state.imageLoaded) {
      // NOTE: For the link href, we prioritize the remote url over the local url as Edge will not load local blob URLs.
      // For the image src, we prioritize the local blob URL over the remote URL to avoid unnecessary hits to S3
      return (
        <a
          href={this.props.message.url || this.props.message.localBlobUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={this.props.message.localBlobUrl || this.props.message.url} />
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
      <div
        className={classnames('ImageMessage', ImageMessageStyle, {
          uploading: isUploading,
          fromCustomer,
        })}
      >
        {this.renderImage()}
        {isUploading && (
          <div className="progress">
            <ProgressCircle
              percentage={this.props.message.uploadProgress || 0}
              size={Math.min(60, 0.8 * Math.min(this.state.imageWidth, this.state.imageHeight))}
              progressWidth={4}
              trackWidth={4}
              progressColor={'rgba(255, 255, 255, 0.7)'}
              trackColor="rgba(128, 128, 128, 0.6)"
            />
          </div>
        )}
      </div>
    );
  }
}

export default ImageMessage;
