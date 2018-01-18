import {isMobile} from 'Common/Utils';
import debounce from 'lodash/debounce';

export const getOrientation = (): string => {
  if (Math.abs(window.orientation) === 90) return 'landscape';
  return 'portrait';
};

const orientationCallbacks = [];
export const onOrientationChange = (
  callback: ({orientation: 'portrait' | 'landscape', height: number}) => void,
) => {
  orientationCallbacks.push(callback);
};

const dispatchListeners = () => {
  orientationCallbacks.forEach(c => {
    c({
      orientation: getOrientation(),
      height: window.innerHeight,
    });
  });
};

/**
 * We use a polyfill for orientationchange since not all mobile devices support the event.
 * We cannot just use innerHeight > innerWidth, since on Android Devices, the innerHeight
 * takes into account keyboard height, and iOS does not.  This causes Android devices
 * to think they are in landscape whenever the keyboard is opened if we rely on the above formula.
 */
if (isMobile()) {
  window.addEventListener(
    'orientationchange',
    // Debounce since Android doesn't do the calculation until after the rotation is complete,
    // and iOS11 outputs a new value after it calculates the height of the address and
    // tab bars
    debounce(dispatchListeners, 1000),
    false,
  );
}
