// @flow
import * as i18nService from '../i18n';

const message = {
  id: 'testMessage',
  description: '',
  defaultMessage: 'Hello world',
};

describe('i18nService', function() {
  describe('when intl object registered', function() {
    beforeEach(function() {
      this.mockIntl = {
        formatMessage: () => {},
        formatDate: date => `Formatted date: ${date}`,
      };
      spyOn(this.mockIntl, 'formatMessage').and.callFake(m => m.defaultMessage);
      i18nService.registerIntlObject(this.mockIntl);
    });

    it('can use formatMessage when not in a react component', function() {
      expect(i18nService.formatMessage(message)).toBe('Hello world');
    });

    it('can use formatDate when not in a react component', function() {
      const timestamp = 123456789;
      expect(i18nService.formatDate(timestamp)).toBe(`Formatted date: ${timestamp}`);
    });
  });

  describe('getDisplayString', () => {
    const {getDisplayString} = i18nService;
    expect(getDisplayString(undefined)).toBe('');
    // $FlowIssue - Using `getDisplayString` wrong on purpose
    expect(getDisplayString(null)).toBe('');
    // $FlowIssue - Using `getDisplayString` wrong on purpose
    expect(getDisplayString(false)).toBe('');
    expect(getDisplayString('')).toBe('');
    expect(getDisplayString('string')).toBe('string');
    expect(getDisplayString(message)).toBe(message.defaultMessage);
  });
});
