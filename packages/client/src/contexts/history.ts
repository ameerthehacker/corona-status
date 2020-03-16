import { createContext } from 'react';
import { HistoryService } from '../services/history/history';

const HistoryServiceContext = createContext<HistoryService | undefined>(
  undefined
);

export default HistoryServiceContext;
