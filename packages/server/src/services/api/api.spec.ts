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
    await apiService.fetchData();

    expect(apiService.getNewCases('2020-2-2', 'India')).toBe(2);
    /** below expectation is to ensure that even if data is not
     * available for the current date it will give the data based on
     * last available date for that country
     **/
    expect(apiService.getNewCases('2020-2-3', 'India')).toBe(2);
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
    await apiService.fetchData();

    expect(apiService.getTotalCases('2020-2-2', 'India')).toBe(10);
    expect(apiService.getTotalCases('2020-2-3', 'India')).toBe(10);
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
    await apiService.fetchData();

    expect(apiService.getTotalRecovered('2020-2-2', 'India')).toBe(4);
    expect(apiService.getTotalRecovered('2020-2-3', 'India')).toBe(4);
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
    await apiService.fetchData();

    expect(apiService.getTotalDeaths('2020-2-2', 'India')).toBe(2);
    expect(apiService.getTotalDeaths('2020-2-3', 'India')).toBe(2);
  });

  it('getActiveCases() should return active cases', async () => {
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
    await apiService.fetchData();

    expect(apiService.getActiveCases('2020-2-2', 'India')).toBe(6);
    expect(apiService.getActiveCases('2020-2-3', 'India')).toBe(6);
  });

  it('getLatestDate() should return the latest date', async () => {
    mockResponse(httpService, {
      India: [
        {
          date: '2020-2-5',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        },
        {
          date: '2020-1-2',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        },
        {
          date: '2020-12-12',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        },
        {
          date: '2019-12-12',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        }
      ]
    });

    const apiService = new CovidAPIService(httpService);
    await apiService.fetchData();

    expect(apiService.getLatestDate('India')).toBe('2020-12-12');
  });

  it('isDataAvailableForCountry() should check if country exists in response', async () => {
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
    await apiService.fetchData();

    expect(apiService.isDataAvailableForCountry('India')).toBeTruthy();
    expect(apiService.isDataAvailableForCountry('fucking-country')).toBeFalsy();
  });

  it('getAvailableCountries() should list all countries', async () => {
    mockResponse(httpService, {
      India: [
        {
          date: '2020-2-2',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        }
      ],
      Italy: [
        {
          date: '2020-2-2',
          confirmed: 10,
          deaths: 2,
          recovered: 4
        }
      ]
    });
    const apiService = new CovidAPIService(httpService);
    await apiService.fetchData();

    expect(apiService.getAvailableCountries()).toEqual(['India', 'Italy']);
  });
});
