// This file is run before each test. Use it for any global configuration we want to add to Jest
const blackListedStrings = [];

const includesString = s =>
  blackListedStrings.find(b => typeof s === 'string' && s.indexOf(b) !== -1);

const warn = console.warn;
console.warn = jest.fn(w => {
  if (!includesString(w)) {
    return warn(w);
  }

  return w;
});

const err = console.error;
console.error = jest.fn(e => {
  if (!includesString(e)) {
    return err(e);
  }

  return e;
});

const log = console.log;
console.log = jest.fn(l => {
  if (!includesString(l)) {
    return log(l);
  }

  return l;
});

const info = console.info;
console.info = jest.fn(i => {
  if (!includesString(i)) {
    return info(i);
  }

  return i;
});
