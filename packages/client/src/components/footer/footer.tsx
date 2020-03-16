import React from 'react';
import Flex from '@chakra-ui/core/dist/Flex';
import Text from '@chakra-ui/core/dist/Text';
import Emoji from '../emoji/emoji';
import useColorScheme from '../../components/use-color-scheme/use-color-sheme';
import Link from '@chakra-ui/core/dist/Link';

export default function Footer() {
  const { bgColor, color } = useColorScheme();

  return (
    <Flex
      borderTopWidth="1px"
      justifyContent="center"
      p={1}
      bg={bgColor}
      color={color}
      pos="fixed"
      zIndex={1}
      bottom={0}
      width="100%"
      height="30px"
    >
      <Text fontSize="sm">
        Built with <Emoji emoji="❤️" ariaLabel="heart" />
        by{' '}
        <Link href="https://www.twitter.com/ameerthehacker" isExternal>
          Ameer Jhan
        </Link>
      </Text>
    </Flex>
  );
}
