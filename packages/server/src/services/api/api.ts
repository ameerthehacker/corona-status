import { HttpService } from '../http/http';

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

  async getNewCases(date: string, country: string): Promise<number> {
    const res = await this.fetchData();

    const newCases = res[country].find((dataPoint) => dataPoint.date === date);

    if (newCases === undefined) {
      return 0;
    } else {
      return newCases.confirmed;
    }
  }
}
