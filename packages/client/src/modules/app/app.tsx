import React, { useContext, useEffect, useState } from 'react';
import queryString from 'query-string';
import APIServiceContext from '../../contexts/api';
import Stats, { StatsProps } from '../../components/stats/stats';
import CountryInput from '../../components/country-input/country-input';
import Box from '@chakra-ui/core/dist/Box';
import Text from '@chakra-ui/core/dist/Text';
import Stack from '@chakra-ui/core/dist/Stack';
import useColorScheme from '../../components/use-color-scheme/use-color-sheme';
import Navbar from '../../components/navbar/navbar';
import Loader from '../../components/loader/loader';
import Emoji from '../../components/emoji/emoji';
import EmptyState from '../../components/empty-state/empty-state';
import Flex from '@chakra-ui/core/dist/Flex';
import HistoryServiceContext from '../../contexts/history';

function getCountryFromQueryParams(): string | undefined {
  const country = queryString.parse(window.location.search).country;

  if (country && !Array.isArray(country)) {
    return country;
  } else {
    return undefined;
  }
}

function setCountryInQueryParam(country: string) {
  window.history.replaceState({}, '', `/?country=${country}`);
}

export default function App() {
  const apiService = useContext(APIServiceContext);
  const historyService = useContext(HistoryServiceContext);
  const [stats, setStats] = useState<StatsProps>();
  const [countries, setCountries] = useState<string[]>([]);
  const { bgColor, color } = useColorScheme();
  const [selectedCountry, setSelectedCountry] = useState<string>();

  if (apiService === undefined) {
    throw new Error('`APIServiceContext is not provided in App`');
  }

  if (historyService === undefined) {
    throw new Error('`HistoryServiceContext is not provided in App`');
  }

  const initialCountry =
    getCountryFromQueryParams() || historyService.getLastSearch();

  if (initialCountry) {
    setCountryInQueryParam(initialCountry);
  }

  useEffect(() => {
    apiService.getCountries().then((countries: string[]) => {
      setCountries(countries);

      const lastSearch = historyService.getLastSearch();

      // set current selected country if it exists in the history and available in the list
      if (lastSearch && countries.find((country) => country === lastSearch)) {
        setSelectedCountry(lastSearch);
      }
    });

    // update the body bgColor based on current color mode
    document.body.style.backgroundColor = bgColor;
  }, [apiService, historyService, bgColor]);

  useEffect(() => {
    if (selectedCountry) {
      // remove the old result if exists
      setStats(undefined);
      apiService.getStats(selectedCountry).then((stats: StatsProps) => {
        setStats(stats);
        // set the last successful search
        historyService.setLastSeatch(selectedCountry);
      });
    }
  }, [selectedCountry, apiService, historyService]);

  return (
    <>
      <Navbar />
      <Stack color={color} textAlign="center">
        <Box mt={60} p={4}>
          <CountryInput
            initialCountry={initialCountry}
            onSelected={(country) => {
              setSelectedCountry(country);
              setCountryInQueryParam(country);
            }}
            countries={countries}
          />
        </Box>
        <Flex
          alignItems="center"
          justifyContent="center"
          p={5}
          height="calc(100vh - 200px)"
          textAlign="center"
        >
          {!selectedCountry && <EmptyState />}
          {selectedCountry && !stats && (
            <Loader
              message={
                <Text size="md">
                  <Emoji emoji="🚧" ariaLabel="barigade" />
                  Crunching data <Emoji emoji="🚧" ariaLabel="barigade" />
                </Text>
              }
            />
          )}
          {stats && <Stats {...stats} />}
        </Flex>
      </Stack>
    </>
  );
}
