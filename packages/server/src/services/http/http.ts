import axios from 'axios';

export class HttpService {
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

  get<T>(url: string) {
    return axios.get<T>(this.getUrl(url), {
      responseType: 'json'
    });
  }
}
