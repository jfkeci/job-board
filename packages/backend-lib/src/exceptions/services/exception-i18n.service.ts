import { Injectable } from '@nestjs/common';

import { ExceptionCode } from '../exception-codes.enum';
import { exceptionMessages } from '../i18n/messages';
import { validationMessages, fieldNameTranslations } from '../i18n/validation-messages';
import { DEFAULT_LANGUAGE } from '../types';
import type { SupportedLanguage } from '../types';

@Injectable()
export class ExceptionI18nService {
  getMessage(
    code: ExceptionCode,
    language: SupportedLanguage,
    params?: Record<string, string | number>,
  ): string {
    const messages = exceptionMessages[code];
    if (!messages) {
      return code;
    }

    let message = messages[language] || messages[DEFAULT_LANGUAGE];

    if (params) {
      message = this.interpolate(message, params);
    }

    return message;
  }

  getValidationMessage(
    constraint: string,
    language: SupportedLanguage,
    params?: Record<string, string | number>,
  ): string {
    const messages = validationMessages[constraint] || validationMessages['default'];
    if (!messages) {
      return constraint;
    }

    let message = messages[language] || messages[DEFAULT_LANGUAGE];

    if (params) {
      const translatedParams = { ...params };

      if (typeof params.field === 'string') {
        translatedParams.field = this.translateFieldName(params.field as string, language);
      }

      message = this.interpolate(message, translatedParams);
    }

    return message;
  }

  translateFieldName(field: string, language: SupportedLanguage): string {
    const lastPart = field.includes('.') ? field.split('.').pop() || field : field;

    const camelToTitle = (str: string): string => {
      return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
    };

    const translations = fieldNameTranslations[lastPart];
    if (translations) {
      return translations[language] || translations[DEFAULT_LANGUAGE];
    }

    return camelToTitle(lastPart);
  }

  private interpolate(
    message: string,
    params: Record<string, string | number>,
  ): string {
    let result = message;

    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    return result;
  }
}
