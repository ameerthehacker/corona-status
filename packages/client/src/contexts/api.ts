import { createContext } from 'react';
import { APIService } from '../services/api/api';

const APIServiceContext = createContext<APIService | undefined>(undefined);

export default APIServiceContext;
