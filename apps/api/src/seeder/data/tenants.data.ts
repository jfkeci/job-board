export interface TenantSeedData {
  id?: string;
  code: string;
  name: string;
  domain: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  currency: string;
  timezone: string;
  isActive: boolean;
}

// Default tenant ID used by dashboard for development
export const DEFAULT_TENANT_ID = '8c63afa2-f959-41f8-a548-7bf2a31524da';

export const tenantsData: TenantSeedData[] = [
  {
    id: DEFAULT_TENANT_ID,
    code: 'HR',
    name: 'job-board Croatia',
    domain: 'job-board.hr',
    defaultLanguage: 'hr',
    supportedLanguages: ['hr', 'en'],
    currency: 'EUR',
    timezone: 'Europe/Zagreb',
    isActive: true,
  },
  {
    code: 'SI',
    name: 'job-board Slovenia',
    domain: 'job-board.si',
    defaultLanguage: 'sl',
    supportedLanguages: ['sl', 'en'],
    currency: 'EUR',
    timezone: 'Europe/Ljubljana',
    isActive: true,
  },
  {
    code: 'RS',
    name: 'job-board Serbia',
    domain: 'job-board.rs',
    defaultLanguage: 'sr',
    supportedLanguages: ['sr', 'en'],
    currency: 'RSD',
    timezone: 'Europe/Belgrade',
    isActive: true,
  },
];
