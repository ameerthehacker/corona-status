import React from 'react';
import Emoji from '../emoji/emoji';
import Stack from '@chakra-ui/core/dist/Stack';
import Text from '@chakra-ui/core/dist/Text';
import Box from '@chakra-ui/core/dist/Box';

export interface StatsProps {
  totalCases: number;
  newCases: number;
  activeCases: number;
  totalDeaths: number;
  totalRecovered: number;
}

function getFatalityRate(totalDeaths: number, totoalCases: number): number {
  if (totoalCases === 0) {
    return 0;
  }

  return parseFloat(((totalDeaths / totoalCases) * 100).toFixed(2));
}

export default function Stats(stats: StatsProps) {
  const fatalityRate = getFatalityRate(stats.totalDeaths, stats.totalCases);

  return (
    <Stack spacing={2}>
      <Box fontSize="2xl">
        <Text color="red.500" fontSize="5xl">
          {stats.newCases}
        </Text>
        <Emoji emoji={'🔥'} ariaLabel={'fire'} /> new cases today
      </Box>
      <Box fontSize="2xl">
        <Text color="red.500" fontSize="5xl">
          {stats.totalCases}
        </Text>
        <Emoji emoji={'🤒'} ariaLabel={'sick'} /> active cases
      </Box>
      <Box fontSize="2xl">
        <Text color="red.500" fontSize="5xl">
          {stats.totalDeaths}
        </Text>
        <Emoji emoji={'😢'} ariaLabel={'cry'} /> deaths
      </Box>
      <Box fontSize="2xl">
        <Text color="green.500" fontSize="5xl">
          {stats.totalRecovered}
        </Text>
        <Emoji emoji={'💃'} ariaLabel={'dancer'} /> recovered
      </Box>
      <Box fontSize="2xl">
        <Text fontSize="5xl">{fatalityRate}%</Text>
        <Text fontSize="xs">{Math.ceil(fatalityRate)} in 100 might die</Text>
        <Emoji emoji={'😵'} ariaLabel={'dead'} /> fatality rate
      </Box>
    </Stack>
  );
}
