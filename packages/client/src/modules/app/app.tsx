import React, { useContext, useEffect, useState } from 'react';
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

export default function App() {
  const apiService = useContext(APIServiceContext);
  const [stats, setStats] = useState<StatsProps>();
  const [countries, setCountries] = useState<string[]>([]);
  const { bgColor, color } = useColorScheme();
  const [selectedCountry, setSelectedCountry] = useState<string>();

  if (apiService === undefined) {
    throw new Error('`APIServiceContext is not provided in App`');
  }

  useEffect(() => {
    apiService.getCountries().then((countries: string[]) => {
      setCountries(countries);
    });

    // update the body bgColor based on current color mode
    document.body.style.backgroundColor = bgColor;
  }, [apiService, bgColor]);

  useEffect(() => {
    if (selectedCountry) {
      apiService.getStats(selectedCountry).then((stats: StatsProps) => {
        setStats(stats);
      });
    }
  }, [selectedCountry]);

  return (
    <>
      <Navbar />
      <Stack color={color} textAlign="center">
        <Box mt={60} p={4}>
          <CountryInput
            onSelected={(country) => setSelectedCountry(country)}
            countries={countries}
          />
        </Box>
        <Box textAlign="center">
          {!stats && (
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
        </Box>
      </Stack>
    </>
  );
}
