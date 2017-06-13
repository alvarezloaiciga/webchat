import * as Utils from 'utils/utils';
import {mockLocation} from 'utils/testHelpers';

describe('Utils', () => {
  describe('getCleansedLocation', () => {
    beforeEach(mockLocation);

    it('Removes the QUIQ Object', () => {
      window.location.href = 'testUrl.com';
      expect(Utils.getCleansedLocation()).toBe(window.location.href);

      window.location.gref = 'testUrl.com/standalone/hey';
      expect(Utils.getCleansedLocation()).toBe(window.location.href);

      const baseUrl = 'testUrl.com/standalone/hey?test=hey';

      window.location.href = baseUrl;
      expect(Utils.getCleansedLocation()).toBe(baseUrl);

      window.location.href = `${baseUrl}&QUIQ=test`;
      expect(Utils.getCleansedLocation()).toBe(baseUrl);

      window.location.href = `${baseUrl}&QUIQ=test&foo=bar`;
      expect(Utils.getCleansedLocation()).toBe(`${baseUrl}&foo=bar`);
    });
  });
});
