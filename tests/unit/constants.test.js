const constants = require('../../src/utils/constants');

describe('constants module', () => {
  test('exports customer status values', () => {
    expect(constants.CUSTOMER_STATUS).toEqual({
      STANDARD: 'standard',
      PREMIUM: 'premium'
    });
  });
});