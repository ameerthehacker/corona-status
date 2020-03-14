import format from 'date-fns/format';

export interface Stats {
  totalCases: number;
  newCases: number;
  activeCases: number;
  totalDeaths: number;
  totalRecovered: number;
}

export class APIService {
  constructor(private baseUrl: string) {}

  private getUrl(url: string) {
    let formattedURL;

    if (url.startsWith('/')) {
      formattedURL = url.substr(1);
    } else {
      formattedURL = url;
    }

    return `${this.baseUrl}/${formattedURL}`;
  }

  async getStats(country: string): Promise<Stats> {
    const today = format(Date.now(), 'yyyy-M-d');

    const response = await fetch(
      this.getUrl(`${country}?date=${today}`)
    ).then((res) => res.json());

    return response as Stats;
  }
}
