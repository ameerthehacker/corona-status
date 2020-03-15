import format from 'date-fns/format';
import { StatsProps } from '../../components/stats/stats';
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

  async getStats(country: string): Promise<StatsProps> {
    const today = format(Date.now(), 'yyyy-M-d');

    const response = await fetch(
      this.getUrl(`${country}?date=${today}`)
    ).then((res) => res.json());

    return response as StatsProps;
  }
}
