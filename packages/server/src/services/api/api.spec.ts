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
          date: '2020-2-1',
          confirmed: 10,
          recovered: 1,
          deaths: 0
        },
        {
          date: '2020-2-2',
          confirmed: 12,
          deaths: 0,
          recovered: 1
        }
      ]
    });
    const apiService = new CovidAPIService(httpService);

    expect(await apiService.getNewCases('2020-2-2', 'India')).toBe(2);
  });

  it('getTotalCases() should return total cases', async () => {
    mockResponse(httpService, {
      India: [
        {
          date: '2020-2-2',
          confirmed: 10,
          deaths: 0,
          recovered: 1
        }
      ]
    });
    const apiService = new CovidAPIService(httpService);

    expect(await apiService.getTotalCases('2020-2-2', 'India')).toBe(10);
  });

  it('getTotalRecovered() should return total recovered', async () => {
    mockResponse(httpService, {
      India: [
        {
          date: '2020-2-2',
          confirmed: 10,
          deaths: 0,
          recovered: 4
        }
      ]
    });
    const apiService = new CovidAPIService(httpService);

    expect(await apiService.getTotalRecovered('2020-2-2', 'India')).toBe(4);
  });

  it('getTotalDeaths() should return total deaths', async () => {
    mockResponse(httpService, {
      India: [
        {
          date: '2020-2-2',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        }
      ]
    });
    const apiService = new CovidAPIService(httpService);

    expect(await apiService.getTotalDeaths('2020-2-2', 'India')).toBe(2);
  });
});
