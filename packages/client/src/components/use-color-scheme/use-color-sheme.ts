import { useColorMode } from '@chakra-ui/core';
import { useTheme } from '@chakra-ui/core';

export default function useFormat(): { bgColor: string; color: string } {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const bgColor = {
    light: theme.colors.white,
    dark: theme.colors.gray['800']
  };
  const color = {
    light: theme.colors.gray['800'],
    dark: theme.colors.white
  };

  return {
    bgColor: bgColor[colorMode],
    color: color[colorMode]
  };
}
