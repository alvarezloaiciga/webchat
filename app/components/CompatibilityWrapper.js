// @flow
import React from 'react';
import {supportsFlexbox, supportsSVG} from 'utils/utils';
import classnames from 'classnames';

export type CompatibilityWrapperProps = {
  children: any,
};

const CompatibilityWrapper = (props: CompatibilityWrapperProps) => (
  <div
    className={classnames('CompatibilityWrapper', {
      noFlexbox: !supportsFlexbox(),
      noSvg: !supportsSVG(),
    })}
  >
    {props.children}
  </div>
);

export default CompatibilityWrapper;
