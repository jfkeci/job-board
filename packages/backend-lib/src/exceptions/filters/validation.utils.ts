import { ValidationError } from 'class-validator';

import { ApiException, ApiExceptions } from '../api.exception';
import { ExceptionCode } from '../exception-codes.enum';
import type { ErrorDetail } from '../types';

export interface ValidationExceptionFactory {
  (errors: ValidationError[]): ApiException;
}

const constraintToCodeMap: Record<string, string> = {
  isNotEmpty: ExceptionCode.VALIDATION_FIELD_REQUIRED,
  isDefined: ExceptionCode.VALIDATION_FIELD_REQUIRED,
  isEmail: ExceptionCode.VALIDATION_EMAIL_INVALID,
  isPhoneNumber: ExceptionCode.VALIDATION_PHONE_INVALID,
  isUrl: ExceptionCode.VALIDATION_URL_INVALID,
  isDate: ExceptionCode.VALIDATION_DATE_INVALID,
  isDateString: ExceptionCode.VALIDATION_DATE_INVALID,
  isNumber: ExceptionCode.VALIDATION_NUMBER_INVALID,
  isInt: ExceptionCode.VALIDATION_NUMBER_INVALID,
  isEnum: ExceptionCode.VALIDATION_ENUM_INVALID,
  isArray: ExceptionCode.VALIDATION_ARRAY_INVALID,
  minLength: ExceptionCode.VALIDATION_FIELD_TOO_SHORT,
  maxLength: ExceptionCode.VALIDATION_FIELD_TOO_LONG,
  min: ExceptionCode.VALIDATION_FIELD_INVALID,
  max: ExceptionCode.VALIDATION_FIELD_INVALID,
  matches: ExceptionCode.VALIDATION_FIELD_FORMAT,
  isStrongPassword: ExceptionCode.VALIDATION_PASSWORD_WEAK,
};

export function mapConstraintToCode(constraint: string): string {
  return constraintToCodeMap[constraint] || ExceptionCode.VALIDATION_FIELD_INVALID;
}

export function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): Array<ValidationError & { fullPath: string }> {
  const result: Array<ValidationError & { fullPath: string }> = [];

  for (const error of errors) {
    const fullPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints && Object.keys(error.constraints).length > 0) {
      result.push({ ...error, fullPath });
    }

    if (error.children && error.children.length > 0) {
      result.push(...flattenValidationErrors(error.children, fullPath));
    }
  }

  return result;
}

export function validationErrorsToDetails(errors: ValidationError[]): ErrorDetail[] {
  const flatErrors = flattenValidationErrors(errors);

  return flatErrors.map((error) => {
    const constraints = error.constraints || {};
    const constraintKeys = Object.keys(constraints);
    const firstConstraint = constraintKeys[0] || 'default';
    const constraintMessage = constraints[firstConstraint] || '';

    return {
      field: error.fullPath,
      code: mapConstraintToCode(firstConstraint),
      message: constraintMessage,
      value: redactSensitiveValue(error.fullPath, error.value),
    };
  });
}

function redactSensitiveValue(field: string, value: unknown): unknown {
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard', 'cvv', 'ssn'];
  const fieldLower = field.toLowerCase();

  for (const sensitive of sensitiveFields) {
    if (fieldLower.includes(sensitive.toLowerCase())) {
      return '[REDACTED]';
    }
  }

  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100) + '...';
  }

  return value;
}

export function createValidationExceptionFactory(): ValidationExceptionFactory {
  return (errors: ValidationError[]): ApiException => {
    const details = validationErrorsToDetails(errors);
    return ApiExceptions.validationFailed(details);
  };
}
