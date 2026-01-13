import { RedactorConfig } from './types';

export const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'secret',
  'apiKey',
  'api_key',
  'creditCard',
  'cardNumber',
  'card_number',
  'cvv',
  'cvc',
  'ssn',
  'socialSecurityNumber',
  'social_security_number',
  'bankAccount',
  'bank_account',
  'iban',
  'routingNumber',
  'routing_number',
  'pin',
  'privateKey',
  'private_key',
];

export const DEFAULT_PII_FIELDS = [
  'email',
  'phone',
  'phoneNumber',
  'phone_number',
  'mobile',
  'address',
  'street',
  'city',
  'zipCode',
  'zip_code',
  'postalCode',
  'postal_code',
  'dateOfBirth',
  'date_of_birth',
  'dob',
  'birthDate',
  'birth_date',
  'firstName',
  'first_name',
  'lastName',
  'last_name',
  'fullName',
  'full_name',
  'name',
  'ipAddress',
  'ip_address',
  'ip',
];

const DEFAULT_CONFIG: RedactorConfig = {
  sensitiveFields: DEFAULT_SENSITIVE_FIELDS,
  piiFields: DEFAULT_PII_FIELDS,
  sensitivePatterns: [],
  maskChar: '*',
  preserveLength: false,
};

const REDACTED_VALUE = '[REDACTED]';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,}$/;
const IP_V4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IP_V6_REGEX = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

export function maskValue(value: string, visibleChars = 0): string {
  if (!value || value.length <= visibleChars * 2) {
    return REDACTED_VALUE;
  }

  if (visibleChars === 0) {
    return REDACTED_VALUE;
  }

  const start = value.slice(0, visibleChars);
  const end = value.slice(-visibleChars);
  const masked = '*'.repeat(Math.min(value.length - visibleChars * 2, 6));

  return `${start}${masked}${end}`;
}

export function maskEmail(email: string): string {
  if (!email || !EMAIL_REGEX.test(email)) {
    return REDACTED_VALUE;
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return REDACTED_VALUE;
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return REDACTED_VALUE;
  }

  const maskedLocal =
    localPart.length > 1 ? `${localPart[0]}${'*'.repeat(Math.min(localPart.length - 1, 3))}` : '*';

  const domainName = domainParts.slice(0, -1).join('.');
  const tld = domainParts[domainParts.length - 1];
  const maskedDomain =
    domainName.length > 1
      ? `${domainName[0]}${'*'.repeat(Math.min(domainName.length - 1, 3))}`
      : '*';

  return `${maskedLocal}@${maskedDomain}.${tld}`;
}

export function maskPhone(phone: string): string {
  if (!phone) {
    return REDACTED_VALUE;
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) {
    return REDACTED_VALUE;
  }

  const hasPlus = phone.startsWith('+');
  const prefix = hasPlus ? '+' : '';
  const firstDigits = digits.slice(0, hasPlus ? 1 : 2);
  const lastDigits = digits.slice(-2);
  const maskedMiddle = '*'.repeat(Math.min(digits.length - 4, 6));

  return `${prefix}${firstDigits}${maskedMiddle}${lastDigits}`;
}

export function maskIP(ip: string): string {
  if (!ip) {
    return REDACTED_VALUE;
  }

  if (IP_V4_REGEX.test(ip)) {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }

  if (IP_V6_REGEX.test(ip)) {
    const parts = ip.split(':');
    return `${parts[0]}:${parts[1]}:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`;
  }

  return REDACTED_VALUE;
}

function normalizeFieldName(field: string): string {
  return field.toLowerCase().replace(/[_-]/g, '');
}

function isFieldMatch(fieldName: string, targetFields: string[]): boolean {
  const normalizedField = normalizeFieldName(fieldName);
  return targetFields.some((target) => normalizeFieldName(target) === normalizedField);
}

function detectAndMaskPII(value: string): string {
  if (EMAIL_REGEX.test(value)) {
    return maskEmail(value);
  }

  if (PHONE_REGEX.test(value) && value.replace(/\D/g, '').length >= 7) {
    return maskPhone(value);
  }

  if (IP_V4_REGEX.test(value) || IP_V6_REGEX.test(value)) {
    return maskIP(value);
  }

  return value;
}

export function redactString(value: string, config?: Partial<RedactorConfig>): string {
  if (!value || typeof value !== 'string') {
    return value;
  }

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  for (const pattern of mergedConfig.sensitivePatterns) {
    if (pattern.test(value)) {
      return REDACTED_VALUE;
    }
  }

  return detectAndMaskPII(value);
}

export function redactObject<T>(obj: T, config?: Partial<RedactorConfig>, seen = new WeakSet()): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return redactString(obj, config) as T;
    }
    return obj;
  }

  if (seen.has(obj as object)) {
    return '[Circular Reference]' as T;
  }
  seen.add(obj as object);

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const allSensitiveFields = [
    ...mergedConfig.sensitiveFields,
    ...(config?.sensitiveFields || []),
  ];
  const allPiiFields = [...mergedConfig.piiFields, ...(config?.piiFields || [])];

  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item, config, seen)) as T;
  }

  if (obj instanceof Date) {
    return obj;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (mergedConfig.customRedactors && mergedConfig.customRedactors[key]) {
      result[key] = mergedConfig.customRedactors[key](value);
      continue;
    }

    if (isFieldMatch(key, allSensitiveFields)) {
      result[key] = REDACTED_VALUE;
      continue;
    }

    if (isFieldMatch(key, allPiiFields)) {
      if (typeof value === 'string') {
        if (normalizeFieldName(key).includes('email')) {
          result[key] = maskEmail(value);
        } else if (
          normalizeFieldName(key).includes('phone') ||
          normalizeFieldName(key).includes('mobile')
        ) {
          result[key] = maskPhone(value);
        } else if (normalizeFieldName(key).includes('ip')) {
          result[key] = maskIP(value);
        } else {
          result[key] = maskValue(value, 1);
        }
      } else {
        result[key] = REDACTED_VALUE;
      }
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      result[key] = redactObject(value, config, seen);
    } else if (typeof value === 'string') {
      result[key] = redactString(value, config);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

export function createRedactor(config?: Partial<RedactorConfig>) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  return {
    redact: <T>(obj: T): T => redactObject(obj, mergedConfig),
    redactString: (value: string): string => redactString(value, mergedConfig),
    maskValue,
    maskEmail,
    maskPhone,
    maskIP,
  };
}
