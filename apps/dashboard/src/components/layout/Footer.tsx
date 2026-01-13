'use client';

import { Box, Container, Flex, HStack, Text } from '@borg/ui';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      py={6}
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(10px)"
      borderTop="1px solid"
      borderColor="glass.light.border"
      _dark={{
        bg: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'glass.dark.border',
      }}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          {/* Copyright */}
          <Text fontSize="sm" color="neutral.500">
            {currentYear} Borg Dashboard. All rights reserved.
          </Text>

          {/* Links */}
          <HStack spacing={6}>
            <Link href="/privacy">
              <Text
                fontSize="sm"
                color="neutral.500"
                _hover={{ color: 'primary.500' }}
                cursor="pointer"
              >
                Privacy
              </Text>
            </Link>
            <Link href="/terms">
              <Text
                fontSize="sm"
                color="neutral.500"
                _hover={{ color: 'primary.500' }}
                cursor="pointer"
              >
                Terms
              </Text>
            </Link>
            <Link href="/contact">
              <Text
                fontSize="sm"
                color="neutral.500"
                _hover={{ color: 'primary.500' }}
                cursor="pointer"
              >
                Contact
              </Text>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
