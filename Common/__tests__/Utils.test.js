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
      expect(Utils.camelize('crazy-case word')).toBe('crazyCaseWord');
    });
  });
});

describe('Utils', () => {
  describe('convertToExtensionMessages', () => {
    it('converts messages and attachments', () => {
      expect(
        Utils.convertToExtensionMessages([
          {
            authorType: 'User',
            text: 'message',
            id: '1',
            timestamp: 11,
            type: 'Text',
          },
          {
            authorType: 'Customer',
            type: 'Attachment',
            url: 'https://test.jpg',
            contentType: 'Image',
            id: '2',
            timestamp: 12,
          },
        ]),
      ).toMatchSnapshot();
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
      expect(Utils.camelize('crazy-case word')).toBe('crazyCaseWord');
    });
  });

  describe('domainIsAllowed', () => {
    it('returns true if whitelist has one entry matching domain', () => {
      expect(Utils.domainIsAllowed('foo.com', 'foo.com')).toBe(true);
    });

    it("doesn't mind having a trailing comma in whitelist string", () => {
      expect(Utils.domainIsAllowed('foo.com', 'foo.com,')).toBe(true);
    });

    it('returns true if whitelist is empty string', () => {
      expect(Utils.domainIsAllowed('foo.com', '')).toBe(true);
    });

    it('works with comma-separated whitelist', () => {
      expect(Utils.domainIsAllowed('foo.com', 'bar.com,foo.com')).toBe(true);
    });

    it('returns false if domain is not in whitelist', () => {
      expect(Utils.domainIsAllowed('foobar.com', 'foo.com,bar.com')).toBe(false);
    });
  });
});

describe('Utils', () => {
  describe('buildTemplateString', () => {
    it('renders a normal string as-is', () => {
      expect(Utils.buildTemplateString('hello there, Homer')).toBe('hello there, Homer');
    });

    it('renders a template string with replacement', () => {
      expect(
        Utils.buildTemplateString('Hi {name1}, my name is {name2}', {
          name1: 'scary',
          name2: 'posh',
        }),
      ).toBe('Hi scary, my name is posh');
    });
  });
});
