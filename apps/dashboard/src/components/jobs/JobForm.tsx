'use client';

import {
  EmploymentType,
  RemoteOption,
  ExperienceLevel,
  SalaryPeriod,
  type Job,
  type CreateJobDto,
  type UpdateJobDto,
} from '@borg/types';
import {
  VStack,
  HStack,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  SimpleGrid,
  Heading,
  Divider,
  GlassButton,
  GlassInput,
} from '@borg/ui';
import { Select, Textarea } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { useCategories } from '@/hooks/use-categories';

interface JobFormProps {
  initialData?: Partial<Job>;
  onSubmit: (data: CreateJobDto | UpdateJobDto) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel?: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  categoryId?: string;
  employmentType?: string;
  remoteOption?: string;
  salaryMin?: string;
  salaryMax?: string;
}

const employmentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: 'Full Time',
  [EmploymentType.PART_TIME]: 'Part Time',
  [EmploymentType.CONTRACT]: 'Contract',
  [EmploymentType.FREELANCE]: 'Freelance',
  [EmploymentType.INTERNSHIP]: 'Internship',
};

const remoteOptionLabels: Record<RemoteOption, string> = {
  [RemoteOption.ON_SITE]: 'On-site',
  [RemoteOption.REMOTE]: 'Remote',
  [RemoteOption.HYBRID]: 'Hybrid',
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.ENTRY]: 'Entry Level',
  [ExperienceLevel.JUNIOR]: 'Junior',
  [ExperienceLevel.MID]: 'Mid Level',
  [ExperienceLevel.SENIOR]: 'Senior',
  [ExperienceLevel.LEAD]: 'Lead',
  [ExperienceLevel.EXECUTIVE]: 'Executive',
};

const salaryPeriodLabels: Record<SalaryPeriod, string> = {
  [SalaryPeriod.HOURLY]: 'Per Hour',
  [SalaryPeriod.MONTHLY]: 'Per Month',
  [SalaryPeriod.YEARLY]: 'Per Year',
};

export function JobForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel,
  onCancel,
}: JobFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requirements, setRequirements] = useState(initialData?.requirements || '');
  const [benefits, setBenefits] = useState(initialData?.benefits || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>(
    initialData?.employmentType || ''
  );
  const [remoteOption, setRemoteOption] = useState<RemoteOption | ''>(
    initialData?.remoteOption || ''
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>(
    initialData?.experienceLevel || ''
  );
  const [salaryMin, setSalaryMin] = useState(initialData?.salaryMin?.toString() || '');
  const [salaryMax, setSalaryMax] = useState(initialData?.salaryMax?.toString() || '');
  const [salaryCurrency, setSalaryCurrency] = useState(initialData?.salaryCurrency || 'EUR');
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>(
    initialData?.salaryPeriod || SalaryPeriod.YEARLY
  );
  const [errors, setErrors] = useState<FormErrors>({});

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setRequirements(initialData.requirements || '');
      setBenefits(initialData.benefits || '');
      setCategoryId(initialData.categoryId || '');
      setEmploymentType(initialData.employmentType || '');
      setRemoteOption(initialData.remoteOption || '');
      setExperienceLevel(initialData.experienceLevel || '');
      setSalaryMin(initialData.salaryMin?.toString() || '');
      setSalaryMax(initialData.salaryMax?.toString() || '');
      setSalaryCurrency(initialData.salaryCurrency || 'EUR');
      setSalaryPeriod(initialData.salaryPeriod || SalaryPeriod.YEARLY);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (description.trim().length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }

    if (!remoteOption) {
      newErrors.remoteOption = 'Remote option is required';
    }

    if (salaryMin && salaryMax) {
      const min = parseFloat(salaryMin);
      const max = parseFloat(salaryMax);
      if (min > max) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data: CreateJobDto | UpdateJobDto = {
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.trim() || undefined,
      benefits: benefits.trim() || undefined,
      categoryId,
      employmentType: employmentType as EmploymentType,
      remoteOption: remoteOption as RemoteOption,
      experienceLevel: experienceLevel || undefined,
      salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
      salaryCurrency: salaryCurrency || undefined,
      salaryPeriod: salaryPeriod || undefined,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={8} align="stretch">
        {/* Basic Information */}
        <Box>
          <Heading size="sm" mb={4}>
            Basic Information
          </Heading>
          <VStack spacing={5} align="stretch">
            {/* Title */}
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>Job Title</FormLabel>
              <GlassInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            {/* Category */}
            <FormControl isRequired isInvalid={!!errors.categoryId}>
              <FormLabel>Category</FormLabel>
              <Select
                value={categoryId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}
                placeholder={categoriesLoading ? 'Loading...' : 'Select category...'}
                bg="transparent"
                borderColor="glass.light.border"
                _dark={{ borderColor: 'glass.dark.border' }}
                isDisabled={categoriesLoading}
              >
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
            </FormControl>

            {/* Employment Type and Remote Option */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              <FormControl isRequired isInvalid={!!errors.employmentType}>
                <FormLabel>Employment Type</FormLabel>
                <Select
                  value={employmentType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmploymentType(e.target.value as EmploymentType)}
                  placeholder="Select type..."
                  bg="transparent"
                  borderColor="glass.light.border"
                  _dark={{ borderColor: 'glass.dark.border' }}
                >
                  {Object.entries(employmentTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.employmentType}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.remoteOption}>
                <FormLabel>Remote Option</FormLabel>
                <Select
                  value={remoteOption}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRemoteOption(e.target.value as RemoteOption)}
                  placeholder="Select option..."
                  bg="transparent"
                  borderColor="glass.light.border"
                  _dark={{ borderColor: 'glass.dark.border' }}
                >
                  {Object.entries(remoteOptionLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.remoteOption}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            {/* Experience Level */}
            <FormControl>
              <FormLabel>Experience Level</FormLabel>
              <Select
                value={experienceLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExperienceLevel(e.target.value as ExperienceLevel)}
                placeholder="Select level (optional)..."
                bg="transparent"
                borderColor="glass.light.border"
                _dark={{ borderColor: 'glass.dark.border' }}
              >
                {Object.entries(experienceLevelLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        {/* Job Details */}
        <Box>
          <Heading size="sm" mb={4}>
            Job Details
          </Heading>
          <VStack spacing={5} align="stretch">
            {/* Description */}
            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>Job Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                rows={8}
                bg="transparent"
                borderColor="glass.light.border"
                _dark={{ borderColor: 'glass.dark.border' }}
                _hover={{ borderColor: 'primary.300' }}
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
              <FormHelperText>
                Minimum 100 characters. Markdown is supported.
              </FormHelperText>
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            {/* Requirements */}
            <FormControl>
              <FormLabel>Requirements</FormLabel>
              <Textarea
                value={requirements}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequirements(e.target.value)}
                placeholder="List the skills, experience, and qualifications required..."
                rows={5}
                bg="transparent"
                borderColor="glass.light.border"
                _dark={{ borderColor: 'glass.dark.border' }}
                _hover={{ borderColor: 'primary.300' }}
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
            </FormControl>

            {/* Benefits */}
            <FormControl>
              <FormLabel>Benefits</FormLabel>
              <Textarea
                value={benefits}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBenefits(e.target.value)}
                placeholder="List the benefits and perks offered..."
                rows={5}
                bg="transparent"
                borderColor="glass.light.border"
                _dark={{ borderColor: 'glass.dark.border' }}
                _hover={{ borderColor: 'primary.300' }}
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        {/* Salary Information */}
        <Box>
          <Heading size="sm" mb={4}>
            Salary Information (Optional)
          </Heading>
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              <FormControl>
                <FormLabel>Minimum Salary</FormLabel>
                <GlassInput
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="50000"
                  min={0}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.salaryMax}>
                <FormLabel>Maximum Salary</FormLabel>
                <GlassInput
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="80000"
                  min={0}
                />
                <FormErrorMessage>{errors.salaryMax}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Currency</FormLabel>
                <GlassInput
                  value={salaryCurrency}
                  onChange={(e) => setSalaryCurrency(e.target.value.toUpperCase())}
                  placeholder="EUR"
                  maxLength={3}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Salary Period</FormLabel>
              <Select
                value={salaryPeriod}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSalaryPeriod(e.target.value as SalaryPeriod)}
                maxW="200px"
                bg="transparent"
                borderColor="glass.light.border"
                _dark={{ borderColor: 'glass.dark.border' }}
              >
                {Object.entries(salaryPeriodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        {/* Actions */}
        <HStack spacing={4} justify="flex-end">
          {onCancel && (
            <GlassButton variant="ghost" onClick={onCancel}>
              Cancel
            </GlassButton>
          )}
          <GlassButton
            type="submit"
            colorScheme="primary"
            isLoading={isLoading}
            loadingText="Saving..."
          >
            {submitLabel}
          </GlassButton>
        </HStack>
      </VStack>
    </form>
  );
}
