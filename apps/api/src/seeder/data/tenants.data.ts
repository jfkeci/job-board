export interface TenantSeedData {
  code: string;
  name: string;
  domain: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  currency: string;
  timezone: string;
  isActive: boolean;
}

export const tenantsData: TenantSeedData[] = [
  {
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
