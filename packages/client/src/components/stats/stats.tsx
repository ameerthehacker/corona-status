import React from 'react';
import Emoji from '../emoji/emoji';
import Stack from '@chakra-ui/core/dist/Stack';
import Text from '@chakra-ui/core/dist/Text';

export interface StatsProps {
  totalCases: number;
  newCases: number;
  activeCases: number;
  totalDeaths: number;
  totalRecovered: number;
}

export default function Stats(stats: StatsProps) {
  return (
    <Stack spacing={2}>
      <Text fontSize="2xl">
        <Emoji emoji={'🔥'} ariaLabel={'fire'} /> New Cases: {stats.newCases}
      </Text>
      <Text fontSize="2xl">
        <Emoji emoji={'🤒'} ariaLabel={'sick'} /> Active Cases:{' '}
        {stats.totalCases}
      </Text>
      <Text fontSize="2xl">
        <Emoji emoji={'😢'} ariaLabel={'cry'} /> Total Deaths:{' '}
        {stats.totalDeaths}
      </Text>
      <Text fontSize="2xl">
        <Emoji emoji={'💃'} ariaLabel={'dancer'} /> Total Recovered:{' '}
        {stats.totalRecovered}
      </Text>
    </Stack>
  );
}
