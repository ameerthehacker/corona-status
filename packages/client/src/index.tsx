import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './modules/app/app';
import APIServiceContext from './contexts/api';
import HistoryServiceContext from './contexts/history';
import { APIService } from './services/api/api';
import ThemeProvider from '@chakra-ui/core/dist/ThemeProvider';
import CSSReset from '@chakra-ui/core/dist/CSSReset';
import ColorModeProvider from '@chakra-ui/core/dist/ColorModeProvider';
import { HistoryService } from './services/history/history';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error('env variable `REACT_APP_API_URL` is not defined');
}

const httpService = new APIService(API_URL);
const historyService = new HistoryService();

const el = (
  <APIServiceContext.Provider value={httpService}>
    <HistoryServiceContext.Provider value={historyService}>
      <ThemeProvider>
        <CSSReset />
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </ThemeProvider>
    </HistoryServiceContext.Provider>
  </APIServiceContext.Provider>
);

ReactDOM.render(el, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
