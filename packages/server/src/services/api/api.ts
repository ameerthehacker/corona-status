import { HttpService } from '../http/http';
import { subDays, format } from 'date-fns';

export interface CovidData {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface CovidAPIResponse {
  [country: string]: Array<CovidData>;
}

export class CovidAPIService {
  private lastUpdated: number = 0;
  private lastResponse: CovidAPIResponse | null = null;
  // cache upto an hour
  private cacheValidityTime: number = 60 * 60 * 1000;

  constructor(
    private httpService: HttpService,
    private endpoint = 'timeseries.json'
  ) {}

  private get isCacheValid(): boolean {
    // cache is valid only for one hour
    return Date.now() - this.lastUpdated <= this.cacheValidityTime;
  }

  public getLatestDate(country: string): string {
    if (this.lastResponse === null)
      throw new Error('no data is available to compute latest date');

    const res = this.lastResponse;
    let maxDate = 0;

    for (let dataPoint of res[country]) {
      const date = new Date(dataPoint.date).getTime();

      if (date > maxDate) {
        maxDate = date;
      }
    }

    return format(maxDate, 'yyyy-M-d');
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

  getDataPoint(date: string, country: string): CovidData {
    if (this.lastResponse === null)
      throw new Error('no data is available to compute data point');

    const res = this.lastResponse;

    const dataPoint = res[country].find((dataPoint) => dataPoint.date === date);

    // datapoint is not available for this date look for the latest date
    if (dataPoint === undefined) {
      return this.getDataPoint(this.getLatestDate(country), country);
    }

    return dataPoint;
  }

  getTotalCases(date: string, country: string): number {
    const dataPoint = this.getDataPoint(date, country);

    return dataPoint.confirmed;
  }

  getDayBefore(date: string, country: string): string {
    const currentDate = new Date(date);
    const latestDate = new Date(this.getLatestDate(country));

    if (currentDate.getTime() > latestDate.getTime()) {
      return format(subDays(latestDate, 1), 'yyyy-M-d');
    } else {
      return format(subDays(currentDate, 1), 'yyyy-M-d');
    }
  }

  getNewCases(date: string, country: string): number {
    const lastNoOfCases = this.getTotalCases(date, country);
    const dayBefore = this.getDayBefore(date, country);
    const dayBeforeNoOfCases = this.getTotalCases(dayBefore, country);
    const newCases = lastNoOfCases - dayBeforeNoOfCases;

    return newCases;
  }

  getTotalRecovered(date: string, country: string): number {
    const dataPoint = this.getDataPoint(date, country);

    return dataPoint.recovered;
  }

  getTotalDeaths(date: string, country: string): number {
    const dataPoint = this.getDataPoint(date, country);

    return dataPoint.deaths;
  }

  getActiveCases(date: string, country: string): number {
    return (
      this.getTotalCases(date, country) - this.getTotalRecovered(date, country)
    );
  }

  isDataAvailableForCountry(country: string): boolean {
    if (this.lastResponse === null)
      throw new Error('no data is available to check country existense');

    const res = this.lastResponse;

    return !(res[country] === undefined);
  }

  getAvailableCountries(): string[] {
    if (this.lastResponse === null)
      throw new Error('no data is available to get available countries');

    return Object.keys(this.lastResponse);
  }
}
