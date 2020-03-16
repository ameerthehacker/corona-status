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
        <Emoji emoji={'🔥'} ariaLabel={'fire'} /> {stats.newCases} new cases
        today
      </Text>
      <Text fontSize="2xl">
        <Emoji emoji={'🤒'} ariaLabel={'sick'} /> {stats.totalCases} active
        cases
      </Text>
      <Text fontSize="2xl">
        <Emoji emoji={'😢'} ariaLabel={'cry'} /> {stats.totalDeaths} deaths
      </Text>
      <Text fontSize="2xl">
        <Emoji emoji={'💃'} ariaLabel={'dancer'} /> {stats.totalRecovered}{' '}
        recovered
      </Text>
    </Stack>
  );
}
