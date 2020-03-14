import { getNewCases } from './api';

describe("API", () => {
  it('getNewCases() should return new cases', () => {
    expect(getNewCases('india')).toBe(0);
  });
});