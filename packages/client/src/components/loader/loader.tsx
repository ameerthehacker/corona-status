import React, { ReactElement } from 'react';
import Spinner from '@chakra-ui/core/dist/Spinner';
import Stack from '@chakra-ui/core/dist/Stack';

export interface LoaderProps {
  message: ReactElement;
}

export default function Loader({ message }: LoaderProps) {
  return (
    <Stack alignItems="center">
      <Spinner color="red.500" size="xl" />
      {message}
    </Stack>
  );
}
