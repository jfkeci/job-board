'use client';

import { JobTier, PromotionType } from '@job-board/types';
import {
  VStack,
  HStack,
  Text,
  Box,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Divider,
  Icon,
  GlassButton,
  GlassModal,
  GlassModalOverlay,
  GlassModalContent,
  GlassModalHeader,
  GlassModalBody,
  GlassModalFooter,
  GlassModalCloseButton,
} from '@job-board/ui';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { useState } from 'react';
import { FiStar, FiTrendingUp, FiZap, FiShare2 } from 'react-icons/fi';

import { usePublishJob } from '@/hooks/use-jobs';

interface PublishJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onSuccess?: () => void;
}

interface TierInfo {
  name: string;
  description: string;
  features: string[];
  price: string;
}

const tierInfo: Record<JobTier, TierInfo> = {
  [JobTier.BASIC]: {
    name: 'Basic',
    description: 'Standard job listing',
    features: ['30 days visibility', 'Standard search placement'],
    price: 'Free',
  },
  [JobTier.STANDARD]: {
    name: 'Standard',
    description: 'Enhanced visibility',
    features: [
      '30 days visibility',
      'Priority search placement',
      'Highlighted in results',
    ],
    price: '49',
  },
  [JobTier.PREMIUM]: {
    name: 'Premium',
    description: 'Maximum exposure',
    features: [
      '30 days visibility',
      'Top search placement',
      'Featured on homepage',
      'Social media promotion',
    ],
    price: '99',
  },
};

const promotionInfo: Record<
  PromotionType,
  { label: string; icon: typeof FiStar; price: string }
> = {
  [PromotionType.FEATURED]: {
    label: 'Featured Badge',
    icon: FiStar,
    price: '+19',
  },
  [PromotionType.HIGHLIGHTED]: {
    label: 'Highlighted Background',
    icon: FiTrendingUp,
    price: '+9',
  },
  [PromotionType.TOP_POSITION]: {
    label: 'Top Position',
    icon: FiZap,
    price: '+29',
  },
  [PromotionType.SOCIAL_BOOST]: {
    label: 'Social Media Boost',
    icon: FiShare2,
    price: '+39',
  },
};

export function PublishJobModal({
  isOpen,
  onClose,
  jobId,
  onSuccess,
}: PublishJobModalProps) {
  const [selectedTier, setSelectedTier] = useState<JobTier>(JobTier.BASIC);
  const [selectedPromotions, setSelectedPromotions] = useState<PromotionType[]>(
    [],
  );
  const publishJob = usePublishJob(jobId);

  const handlePublish = async () => {
    try {
      await publishJob.mutateAsync({
        tier: selectedTier,
        promotions:
          selectedPromotions.length > 0 ? selectedPromotions : undefined,
      });
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} size="lg">
      <GlassModalOverlay />
      <GlassModalContent>
        <GlassModalHeader>Publish Job</GlassModalHeader>
        <GlassModalCloseButton />
        <GlassModalBody>
          <VStack spacing={6} align="stretch">
            {/* Error Alert */}
            {publishJob.error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {publishJob.error instanceof Error
                  ? publishJob.error.message
                  : 'Failed to publish job'}
              </Alert>
            )}

            {/* Tier Selection */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                Select Listing Tier
              </Text>
              <RadioGroup
                value={selectedTier}
                onChange={(v) => setSelectedTier(v as JobTier)}
              >
                <VStack spacing={3} align="stretch">
                  {Object.entries(tierInfo).map(([tier, info]) => (
                    <Box
                      key={tier}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={
                        selectedTier === tier
                          ? 'primary.500'
                          : 'glass.light.border'
                      }
                      _dark={{
                        borderColor:
                          selectedTier === tier
                            ? 'primary.500'
                            : 'glass.dark.border',
                      }}
                      cursor="pointer"
                      onClick={() => setSelectedTier(tier as JobTier)}
                      transition="all 0.2s"
                      _hover={{ borderColor: 'primary.300' }}
                    >
                      <HStack justify="space-between" mb={2}>
                        <HStack spacing={3}>
                          <Radio value={tier} />
                          <Box>
                            <Text fontWeight="medium">{info.name}</Text>
                            <Text fontSize="sm" color="neutral.500">
                              {info.description}
                            </Text>
                          </Box>
                        </HStack>
                        <Text fontWeight="bold" color="primary.500">
                          {info.price === 'Free'
                            ? info.price
                            : `€${info.price}`}
                        </Text>
                      </HStack>
                      <VStack align="start" spacing={1} pl={8}>
                        {info.features.map((feature, idx) => (
                          <Text
                            key={idx}
                            fontSize="sm"
                            color="neutral.600"
                            _dark={{ color: 'neutral.400' }}
                          >
                            • {feature}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </RadioGroup>
            </Box>

            <Divider />

            {/* Promotion Options */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                Add Promotions (Optional)
              </Text>
              <CheckboxGroup
                value={selectedPromotions}
                onChange={(values) =>
                  setSelectedPromotions(values as PromotionType[])
                }
              >
                <VStack spacing={2} align="stretch">
                  {Object.entries(promotionInfo).map(([promotion, info]) => (
                    <HStack
                      key={promotion}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={
                        selectedPromotions.includes(promotion as PromotionType)
                          ? 'primary.500'
                          : 'glass.light.border'
                      }
                      _dark={{
                        borderColor: selectedPromotions.includes(
                          promotion as PromotionType,
                        )
                          ? 'primary.500'
                          : 'glass.dark.border',
                      }}
                      justify="space-between"
                    >
                      <HStack spacing={3}>
                        <Checkbox value={promotion} />
                        <Icon as={info.icon} color="primary.500" />
                        <Text fontSize="sm">{info.label}</Text>
                      </HStack>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="primary.500"
                      >
                        {info.price}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </CheckboxGroup>
            </Box>
          </VStack>
        </GlassModalBody>

        <GlassModalFooter>
          <HStack spacing={3}>
            <GlassButton variant="ghost" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton
              colorScheme="green"
              onClick={handlePublish}
              isLoading={publishJob.isPending}
              loadingText="Publishing..."
            >
              Publish Job
            </GlassButton>
          </HStack>
        </GlassModalFooter>
      </GlassModalContent>
    </GlassModal>
  );
}
