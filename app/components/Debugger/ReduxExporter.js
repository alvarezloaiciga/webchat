// @flow

import React from 'react';
import {getFormattedDateAndTime} from 'utils/utils';
import {saveAs} from 'file-saver';

type ReduxExporterProps = {
  monitorState?: {initialScrollTop: number}, // eslint-disable-line react/no-unused-prop-types
  actionsById?: Object,
  nextActionId?: number,
  stagedActionIds?: Array<number>,
  skippedActionIds?: Array<number>,
  committedState?: Object,
  computedStates?: Array<Object>, // eslint-disable-line react/no-unused-prop-types
  currentStateIndex?: number,
};

export class ReduxExporter extends React.Component {
  props: ReduxExporterProps;

  exportReduxState = () => {
    saveAs(
      new Blob([JSON.stringify(this.getStateAndActions(), null, 2)], {
        type: 'application/json;charset=utf-8',
      }),
      `chat-${getFormattedDateAndTime(new Date())}`,
    );
  };

  getStateAndActions = () => ({
    monitorState: this.props.monitorState,
    actionsById: this.props.actionsById,
    nextActionId: this.props.nextActionId,
    stagedActionIds: this.props.stagedActionIds,
    skippedActionIds: this.props.skippedActionIds,
    committedState: this.props.committedState,
    computedStates: [],
    currentStateIndex: this.props.currentStateIndex,
  });

  render() {
    return (
      <div className="ReduxExporter">
        <i
          className={`fa fa-download icon`}
          title="Export Redux State"
          onClick={this.exportReduxState}
        />
      </div>
    );
  }
}

export default ReduxExporter;
