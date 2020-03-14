import { CovidAPIService, CovidAPIResponse } from './api';
import { HttpService } from '../http/http';

describe('API', () => {
  let httpService: HttpService;

  function mockResponse(httpService: HttpService, response: CovidAPIResponse) {
    httpService.get = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: response
      })
    );
  }

  beforeEach(() => {
    httpService = new HttpService('https://some-api');
  });

  it('getNewCases() should return new cases', async () => {
    mockResponse(httpService, {
      India: [
        {
          date: '2020-2-2',
          confirmed: 2,
          deaths: 0,
          recovered: 1
        },
        {
          date: '2020-2-3',
          confirmed: 2,
          deaths: 0,
          recovered: 1
        },
        {
          date: '2020-2-4',
          confirmed: 2,
          deaths: 0,
          recovered: 1
        }
      ]
    });
    const apiService = new CovidAPIService(httpService);

    expect(await apiService.getNewCases('2020-2-4', 'India')).toBe(2);
  });
});
