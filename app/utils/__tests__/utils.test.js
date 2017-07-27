import * as Utils from 'utils/utils';

describe('Utils', () => {
  describe('camelize', () => {
    it('converts Sentence Case to camelCase', () => {
      expect(Utils.camelize('Sentence Case')).toBe('sentenceCase');
    });

    it('converts camelCase to camelCase', () => {
      expect(Utils.camelize('camelCase')).toBe('camelCase');
    });

    it('converts lower case to camelCase', () => {
      expect(Utils.camelize('lower case')).toBe('lowerCase');
    });

    it('converts Upper Case to camelCase', () => {
      expect(Utils.camelize('Upper Case')).toBe('upperCase');
    });

    it('converts crazy-case_words without blowing up', () => {
      expect(Utils.camelize('crazy-case word')).toBe('crazy-CaseWord');
    });
  });
});
