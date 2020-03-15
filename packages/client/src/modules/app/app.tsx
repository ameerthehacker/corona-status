import React, { useContext, useEffect, useState } from 'react';
import APIServiceContext from '../../contexts/api';
import Stats, { StatsProps } from '../../components/stats/stats';
import CountryInput from '../../components/country-input/country-input';
import Box from '@chakra-ui/core/dist/Box';
import Text from '@chakra-ui/core/dist/Text';
import Emoji from '../../components/emoji/emoji';
import Stack from '@chakra-ui/core/dist/Stack';

export default function App() {
  const apiService = useContext(APIServiceContext);
  const [stats, setStats] = useState<StatsProps>();

  if (apiService === undefined) {
    throw new Error('`APIServiceContext is not provided in App`');
  }

  useEffect(() => {
    apiService.getStats('India').then((stats: StatsProps) => {
      setStats(stats);
    });
  }, [apiService]);

  return (
    <Stack spacing={8} textAlign="center">
      <Box>
        <Text fontSize="4xl">
          Corona Status <Emoji emoji="📉" ariaLabel="chart" />
        </Text>
      </Box>
      <Box>
        <CountryInput countries={['India', 'Indiana', 'Australia']} />
      </Box>
      <Box>
        {!stats && <Text>Crunching Data...</Text>}
        {stats && <Stats {...stats} />}
      </Box>
    </Stack>
  );
}
