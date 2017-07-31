// @flow
import {getStyle} from '../quiq';

const testStyle = {
  background: '#31bf8b',
};

describe('QUIQ util', () => {
  describe('getStyle', () => {
    it('returns the style if it exists', () => {
      expect(getStyle(testStyle)).toEqual({
        background: '#31bf8b',
      });
    });

    it('returns an empty object if style is not defined', () => {
      expect(getStyle(undefined)).toEqual({});
    });

    it('applies defaults', () => {
      expect(getStyle(testStyle, {fontFamily: 'Source Sans Pro'})).toEqual({
        background: '#31bf8b',
        fontFamily: 'Source Sans Pro',
      });
    });

    it('overrides defaults', () => {
      expect(
        getStyle(testStyle, {fontFamily: 'Source Sans Pro', background: 'palevioletred'}),
      ).toEqual({
        background: '#31bf8b',
        fontFamily: 'Source Sans Pro',
      });
    });

    describe('when property is not supported', () => {
      it('throws an error', () => {
        expect(() => getStyle({position: 'fixed'})).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
