import {isIOS, getBrowserName} from 'Common/Utils';
import debounce from 'lodash/debounce';

export const getOrientation = () =>
  window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

const handlers = [];
export const onHeightChange = (callback: (newHeight: number) => void) => {
  handlers.push(callback);
};

/**
 * Calculate height by creating a div and measuring it.
 * We need to do this because in certain cases in iOS Chrome,
 * window.innerHeight gets stale.  This happens when
 * you open the keyboard in portrait, rotate to landscape,
 * then rotate back to portrait and close the keyboard.
 */
const calcIOSPortraitHeight = function() {
  const ruler = document.createElement('div');

  ruler.style.position = 'fixed';
  ruler.style.height = '100vh';
  ruler.style.width = 0;
  ruler.style.top = 0;

  document.documentElement.appendChild(ruler);
  const height = ruler.offsetHeight;
  document.documentElement.removeChild(ruler);
  return height;
};

const requiresHeightFix =
  isIOS() && getOrientation() === 'portrait' && getBrowserName() === 'Chrome';

/**
 * We need to expose this because in iOS Chrome, if you do the steps listed above
 * to gets window.innerHeight into a bad state, and refresh, window.innerHeight
 * stays in a bad state.  Force the initial calculation to fix this initial bad state
 */
export const getHeight = () => {
  if (requiresHeightFix) return calcIOSPortraitHeight();
  return window.innerHeight;
};

let height = window.innerHeight;
let orientation = getOrientation();

const calculateHeight = () => {
  const newOrientation = getOrientation();
  const orientationChanged = newOrientation !== orientation;

  if (orientationChanged) {
    orientation = newOrientation;
  }

  if (
    requiresHeightFix &&
    ((orientationChanged && newOrientation === 'portrait') || window.innerHeight !== height)
  ) {
    return calcIOSPortraitHeight();
  } else if (window.innerHeight !== height) {
    return window.innerHeight;
  }

  return height;
};

const dispatchListeners = () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    handlers.forEach(h => h(height));
  }, 0);
};

/**
 * There is an iOS Chrome issue that causes window.innerHeight to get stale,
 * and sometimes the resize listener won't get called.  Compensate
 * for this by adding our own listeners.
 */
setInterval(() => {
  const origHeight = height;
  height = calculateHeight();

  if (origHeight !== height) {
    dispatchListeners();
  }
}, 250);

/**
 * There is an issue in iOS Chrome where sometimes if you drag while the keyboard
 * is open, it will cause height to get stale, fix it here.
 */
window.addEventListener('resize', () => {
  document.activeElement.blur();
  debounce(dispatchListeners, 250);
});
