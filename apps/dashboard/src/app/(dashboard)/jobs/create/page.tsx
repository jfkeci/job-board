'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  GlassCard,
} from '@borg/ui';
import { FiBriefcase } from 'react-icons/fi';

export default function CreateJobPage() {
  return (
    <Container maxW="4xl" py={8}>
      <GlassCard p={{ base: 8, md: 12 }}>
        <VStack spacing={6} textAlign="center">
          <Box
            w={16}
            h={16}
            bg="primary.100"
            _dark={{ bg: 'primary.900' }}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              as={FiBriefcase}
              w={8}
              h={8}
              color="primary.500"
            />
          </Box>

          <VStack spacing={2}>
            <Heading as="h1" size="lg">
              Create Job Advertisement
            </Heading>
            <Text
              color="neutral.600"
              _dark={{ color: 'neutral.400' }}
              maxW="md"
            >
              Job creation form coming soon. You&apos;ll be able to create and
              manage your job postings from here.
            </Text>
          </VStack>

          <Box
            p={4}
            bg="primary.50"
            _dark={{ bg: 'primary.900/30', borderColor: 'primary.800' }}
            borderRadius="md"
            borderWidth="1px"
            borderColor="primary.200"
          >
            <Text fontSize="sm" color="primary.700" _dark={{ color: 'primary.300' }}>
              This page will include job title, description, requirements,
              salary range, location, and more.
            </Text>
          </Box>
        </VStack>
      </GlassCard>
    </Container>
  );
}
