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
    name: 'borg Croatia',
    domain: 'borg.hr',
    defaultLanguage: 'hr',
    supportedLanguages: ['hr', 'en'],
    currency: 'EUR',
    timezone: 'Europe/Zagreb',
    isActive: true,
  },
  {
    code: 'SI',
    name: 'borg Slovenia',
    domain: 'borg.si',
    defaultLanguage: 'sl',
    supportedLanguages: ['sl', 'en'],
    currency: 'EUR',
    timezone: 'Europe/Ljubljana',
    isActive: true,
  },
  {
    code: 'RS',
    name: 'borg Serbia',
    domain: 'borg.rs',
    defaultLanguage: 'sr',
    supportedLanguages: ['sr', 'en'],
    currency: 'RSD',
    timezone: 'Europe/Belgrade',
    isActive: true,
  },
];
