import { useColorMode } from '@chakra-ui/core';

export default function useFormat(): { bgColor: string; color: string } {
  const { colorMode } = useColorMode();

  const bgColor = {
    light: 'white',
    dark: 'gray.800'
  };
  const color = {
    light: 'gray.800',
    dark: 'white'
  };

  return {
    bgColor: bgColor[colorMode],
    color: color[colorMode]
  };
}
