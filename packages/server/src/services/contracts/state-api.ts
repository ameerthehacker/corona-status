import { CovidAPIResponse } from '../api/api';

export interface StateAPIService {
  getDataPoints(): Promise<CovidAPIResponse>;
}
