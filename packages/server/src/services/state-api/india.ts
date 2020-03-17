import { HttpService } from '../http/http';
import { CovidAPIResponse } from '../api/api';
import { StateAPIService } from '../contracts/state-api';

export interface IndianStateData {
  totalIndianCases: number;
  totalForeignCases: number;
  totalRecovered: number;
  totalDeaths: number;
}

export interface IndianStateAPIResponse {
  data: {
    [key: string]: IndianStateData;
  };
  lastUpdated: string;
}

export class IndianStateAPIService implements StateAPIService {
  constructor(
    private httpService: HttpService,
    private endpoint: string = 'covid19-indian-states.json'
  ) {}

  async getDataPoints(): Promise<CovidAPIResponse> {
    const covidAPIresponse: CovidAPIResponse = {};
    const response = await this.httpService
      .get<IndianStateAPIResponse>(this.endpoint)
      .then((res) => res.data);

    for (const stateName in response.data) {
      covidAPIresponse[`${stateName} (India)`] = [
        {
          confirmed:
            response.data[stateName].totalIndianCases +
            response.data[stateName].totalForeignCases,
          // harcoding this date as the time series data is not available
          date: '1995-1-1',
          deaths: response.data[stateName].totalDeaths,
          recovered: response.data[stateName].totalRecovered
        }
      ];
    }

    return covidAPIresponse;
  }
}
