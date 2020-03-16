export class HistoryService {
  private KEY: string = 'LAST_SEARCH';

  getLastSearch(): string | null {
    return localStorage.getItem(this.KEY);
  }

  setLastSeatch(query: string) {
    localStorage.setItem(this.KEY, query);
  }
}
