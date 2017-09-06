import * as Utils from 'Common/Utils';

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

describe('Utils', () => {
  describe('buildTemplateString', () => {
    it('renders a normal string as-is', () => {
      expect(Utils.buildTemplateString("hello there, Homer")).toBe("hello there, Homer");
    });

    it('renders a template string with replacement', () => {
      expect(Utils.buildTemplateString("Hi {name1}, my name is {name2}", {name1: 'scary', name2: 'posh'}))
        .toBe("Hi scary, my name is posh");
    });
  });
});
