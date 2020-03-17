import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import useToast from '@chakra-ui/core/dist/Toast';
import Box from '@chakra-ui/core/dist/Box';
import Text from '@chakra-ui/core/dist/Text';
import Button from '@chakra-ui/core/dist/Button';
import * as serviceWorker from './serviceWorker';
import App from './modules/app/app';
import APIServiceContext from './contexts/api';
import HistoryServiceContext from './contexts/history';
import { APIService } from './services/api/api';
import ThemeProvider from '@chakra-ui/core/dist/ThemeProvider';
import CSSReset from '@chakra-ui/core/dist/CSSReset';
import ColorModeProvider from '@chakra-ui/core/dist/ColorModeProvider';
import { HistoryService } from './services/history/history';
import Icon from '@chakra-ui/core/dist/Icon';
import Stack from '@chakra-ui/core/dist/Stack';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error('env variable `REACT_APP_API_URL` is not defined');
}

const httpService = new APIService(API_URL);
const historyService = new HistoryService();

// init Google Analytics
if (
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_GA_TRACKING_CODE !== undefined
) {
  import('react-ga').then((ReactGA) => {
    // Checking it again since typescript failed us;
    if (process.env.REACT_APP_GA_TRACKING_CODE !== undefined) {
      ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE);
    }
  });
}

function Root() {
  const toast = useToast();

  useEffect(() => {
    serviceWorker.register({
      onUpdate() {
        toast({
          render: function ToastBody() {
            return (
              <Box
                m={3}
                color="white"
                p={3}
                borderRadius={5}
                boxShadow="lg"
                bg="blue.500"
              >
                <Stack direction="row" alignItems="center">
                  <Icon name="info" />
                  <Text fontSize="sm">New updates are available</Text>
                  <Button
                    variantColor="blue.500"
                    variant="ghost"
                    fontWeight="bold"
                    onClick={() => window.location.reload()}
                  >
                    REFRESH
                  </Button>
                </Stack>
              </Box>
            );
          }
        });
      }
    });
  }, [toast]);

  return (
    <APIServiceContext.Provider value={httpService}>
      <HistoryServiceContext.Provider value={historyService}>
        <App />
      </HistoryServiceContext.Provider>
    </APIServiceContext.Provider>
  );
}

const el = (
  <ThemeProvider>
    <CSSReset />
    <ColorModeProvider>
      <Root />
    </ColorModeProvider>
  </ThemeProvider>
);

ReactDOM.render(el, document.getElementById('root'));
