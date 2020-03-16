import React from 'react';
import useColorScheme from '../../components/use-color-scheme/use-color-sheme';
import Flex from '@chakra-ui/core/dist/Flex';
import Text from '@chakra-ui/core/dist/Text';
import { ReactComponent as Logo } from './logo.svg';
import Stack from '@chakra-ui/core/dist/Stack';
import Icon from '@chakra-ui/core/dist/Icon';
import { useColorMode } from '@chakra-ui/core';
import Button from '@chakra-ui/core/dist/Button';

export default function Navbar() {
  const { bgColor, color } = useColorScheme();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      color={color}
      bg={bgColor}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      pos="fixed"
      zIndex={9999}
      top={0}
      height={60}
      width="100%"
      px={4}
      borderBottomWidth="1px"
    >
      <Stack
        position="absolute"
        justifyContent="center"
        width="100%"
        direction="row"
      >
        <Logo fill={color} height="30px" />
        <Text ml={1} fontStyle="light" fontWeight="light" fontSize="2xl">
          Corona Status
        </Text>
      </Stack>
      <Stack>
        <Button variant="link" onClick={toggleColorMode}>
          <Icon
            height="1.5em"
            width="1.5em"
            name={colorMode === 'light' ? 'moon' : 'sun'}
          />
        </Button>
      </Stack>
    </Flex>
  );
}
