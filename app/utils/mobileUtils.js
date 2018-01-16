export const getOrientation = () =>
  window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

const handlers = [];
export const onHeightChange = (callback: (newHeight: number) => void) => {
  handlers.push(callback);
};

let height = window.innerHeight;
setInterval(() => {
  if (window.innerHeight !== height) {
    height = window.innerHeight;
    setTimeout(() => {
      window.scrollTo(0, 0);
      handlers.forEach(h => h(window.innerHeight));
    }, 0);
  }
}, 2000);
