import { HttpService } from './http';
import axios from 'axios';

describe('HttpService', () => {
  it('should make proper get request', async () => {
    const httpService = new HttpService('http://example.com');
    axios.get = jest.fn().mockReturnValue(Promise.resolve('my-own-response'));

    const response = await httpService.get('/api');

    expect(response).toBe('my-own-response');
    expect(axios.get).toHaveBeenCalledWith('http://example.com/api', {
      responseType: 'json'
    });
  });
});
