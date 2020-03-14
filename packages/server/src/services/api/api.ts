import { HttpService } from '../http/http';
import { subDays, format } from 'date-fns';

export interface CovidAPIResponse {
  [country: string]: Array<{
    date: string;
    confirmed: number;
    deaths: number;
    recovered: number;
  }>;
}

export class CovidAPIService {
  private lastUpdated: number = 0;
  private lastResponse: CovidAPIResponse | null = null;
  private cacheValidityTime: number = 5 * 60 * 1000;

  constructor(
    private httpService: HttpService,
    private endpoint = 'timeseries.json'
  ) {}

  private get isCacheValid(): boolean {
    // cache is valid only for five minutes
    return Date.now() - this.lastUpdated <= this.cacheValidityTime;
  }

  async fetchData() {
    if (this.lastResponse !== null && this.isCacheValid) {
      return this.lastResponse;
    }

    // make the request
    this.lastResponse = await this.httpService
      .get<CovidAPIResponse>(this.endpoint)
      .then((res) => res.data);
    this.lastUpdated = Date.now();

    if (this.lastResponse === null || this.lastResponse === undefined) {
      throw new Error(`unable to fetch data`);
    }
  }

  getTotalCases(date: string, country: string): number {
    if (this.lastResponse === null) return 0;

    const res = this.lastResponse;

    const dataPoint = res[country].find(
      (dataPoint) => dataPoint.date === date
    ) || { confirmed: 0 };

    return dataPoint.confirmed;
  }

  getNewCases(date: string, country: string): number {
    if (this.lastResponse === null) return 0;

    const res = this.lastResponse;
    const yesterDay = format(subDays(new Date(date), 1), 'yyyy-M-d');

    const dataPoint = res[country].find(
      (dataPoint) => dataPoint.date === date
    ) || { confirmed: 0 };
    const yesterDayDataPoint = res[country].find(
      (dataPoint) => dataPoint.date === yesterDay
    ) || { confirmed: 0 };

    const newCases = dataPoint.confirmed - yesterDayDataPoint.confirmed;

    return newCases;
  }

  getTotalRecovered(date: string, country: string): number {
    if (this.lastResponse === null) return 0;

    const res = this.lastResponse;

    const dataPoint = res[country].find(
      (dataPoint) => dataPoint.date === date
    ) || { recovered: 0 };

    return dataPoint.recovered;
  }

  getTotalDeaths(date: string, country: string): number {
    if (this.lastResponse === null) return 0;

    const res = this.lastResponse;

    const dataPoint = res[country].find(
      (dataPoint) => dataPoint.date === date
    ) || { deaths: 0 };

    return dataPoint.deaths;
  }

  getActiveCases(date: string, country: string): number {
    if (this.lastResponse === null) return 0;

    return (
      this.getTotalCases(date, country) - this.getTotalRecovered(date, country)
    );
  }
}
