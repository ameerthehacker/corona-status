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
    private endpoint = 'covid19/timeseries.json'
  ) {}

  private get isCacheValid(): boolean {
    // cache is valid only for five minutes
    return Date.now() - this.lastUpdated <= this.cacheValidityTime;
  }

  private async fetchData(): Promise<CovidAPIResponse> {
    if (this.lastResponse !== null && this.isCacheValid) {
      return this.lastResponse;
    }

    // make the request
    this.lastResponse = await this.httpService
      .get<CovidAPIResponse>(this.endpoint)
      .then((res) => res.data);

    if (this.lastResponse === null || this.lastResponse === undefined) {
      throw new Error(`unable to fetch data`);
    }

    return this.lastResponse;
  }

  async getTotalCases(date: string, country: string): Promise<number> {
    const res = await this.fetchData();

    const dataPoint = res[country].find(
      (dataPoint) => dataPoint.date === date
    ) || { confirmed: 0 };

    return dataPoint.confirmed;
  }

  async getNewCases(date: string, country: string): Promise<number> {
    const res = await this.fetchData();
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

  async getTotalRecovered(date: string, country: string): Promise<number> {
    const res = await this.fetchData();

    const dataPoint = res[country].find(
      (dataPoint) => dataPoint.date === date
    ) || { recovered: 0 };

    return dataPoint.recovered;
  }
}
