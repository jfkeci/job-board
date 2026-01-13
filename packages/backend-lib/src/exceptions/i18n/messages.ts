import { ExceptionCode } from '../exception-codes.enum';
import type { SupportedLanguage } from '../types';

type MessageRecord = Record<SupportedLanguage, string>;

export const exceptionMessages: Record<ExceptionCode, MessageRecord> = {
  // Authentication
  [ExceptionCode.AUTH_INVALID_CREDENTIALS]: {
    en: 'Invalid email or password',
    hr: 'Neispravna email adresa ili lozinka',
    bs: 'Neispravna email adresa ili lozinka',
    mk: 'Невалидна е-пошта или лозинка',
  },
  [ExceptionCode.AUTH_TOKEN_EXPIRED]: {
    en: 'Your session has expired. Please log in again',
    hr: 'Vaša sesija je istekla. Molimo prijavite se ponovno',
    bs: 'Vaša sesija je istekla. Molimo prijavite se ponovo',
    mk: 'Вашата сесија истече. Ве молиме најавете се повторно',
  },
  [ExceptionCode.AUTH_TOKEN_INVALID]: {
    en: 'Invalid authentication token',
    hr: 'Nevažeći autentifikacijski token',
    bs: 'Nevažeći autentifikacijski token',
    mk: 'Невалиден токен за автентикација',
  },
  [ExceptionCode.AUTH_TOKEN_MISSING]: {
    en: 'Authentication token is required',
    hr: 'Autentifikacijski token je obavezan',
    bs: 'Autentifikacijski token je obavezan',
    mk: 'Потребен е токен за автентикација',
  },
  [ExceptionCode.AUTH_REFRESH_TOKEN_EXPIRED]: {
    en: 'Refresh token has expired. Please log in again',
    hr: 'Token za osvježavanje je istekao. Molimo prijavite se ponovno',
    bs: 'Token za osvježavanje je istekao. Molimo prijavite se ponovo',
    mk: 'Токенот за освежување истече. Ве молиме најавете се повторно',
  },
  [ExceptionCode.AUTH_REFRESH_TOKEN_INVALID]: {
    en: 'Invalid refresh token',
    hr: 'Nevažeći token za osvježavanje',
    bs: 'Nevažeći token za osvježavanje',
    mk: 'Невалиден токен за освежување',
  },
  [ExceptionCode.AUTH_SESSION_EXPIRED]: {
    en: 'Your session has expired',
    hr: 'Vaša sesija je istekla',
    bs: 'Vaša sesija je istekla',
    mk: 'Вашата сесија истече',
  },
  [ExceptionCode.AUTH_ACCOUNT_DISABLED]: {
    en: 'Your account has been disabled',
    hr: 'Vaš račun je onemogućen',
    bs: 'Vaš račun je onemogućen',
    mk: 'Вашата сметка е оневозможена',
  },
  [ExceptionCode.AUTH_ACCOUNT_LOCKED]: {
    en: 'Your account has been locked due to too many failed attempts',
    hr: 'Vaš račun je zaključan zbog previše neuspjelih pokušaja',
    bs: 'Vaš račun je zaključan zbog previše neuspjelih pokušaja',
    mk: 'Вашата сметка е заклучена поради премногу неуспешни обиди',
  },
  [ExceptionCode.AUTH_EMAIL_NOT_VERIFIED]: {
    en: 'Please verify your email address',
    hr: 'Molimo potvrdite vašu email adresu',
    bs: 'Molimo potvrdite vašu email adresu',
    mk: 'Ве молиме потврдете ја вашата е-пошта',
  },
  [ExceptionCode.AUTH_MFA_REQUIRED]: {
    en: 'Two-factor authentication is required',
    hr: 'Potrebna je dvofaktorska autentifikacija',
    bs: 'Potrebna je dvofaktorska autentifikacija',
    mk: 'Потребна е двофакторска автентикација',
  },
  [ExceptionCode.AUTH_MFA_INVALID]: {
    en: 'Invalid two-factor authentication code',
    hr: 'Nevažeći kod za dvofaktorsku autentifikaciju',
    bs: 'Nevažeći kod za dvofaktorsku autentifikaciju',
    mk: 'Невалиден код за двофакторска автентикација',
  },

  // Authorization
  [ExceptionCode.AUTHZ_PERMISSION_DENIED]: {
    en: 'You do not have permission to perform this action',
    hr: 'Nemate dozvolu za izvršenje ove akcije',
    bs: 'Nemate dozvolu za izvršenje ove akcije',
    mk: 'Немате дозвола за оваа акција',
  },
  [ExceptionCode.AUTHZ_ROLE_REQUIRED]: {
    en: 'This action requires a specific role',
    hr: 'Ova akcija zahtijeva određenu ulogu',
    bs: 'Ova akcija zahtijeva određenu ulogu',
    mk: 'Оваа акција бара специфична улога',
  },
  [ExceptionCode.AUTHZ_RESOURCE_ACCESS_DENIED]: {
    en: 'You do not have access to this resource',
    hr: 'Nemate pristup ovom resursu',
    bs: 'Nemate pristup ovom resursu',
    mk: 'Немате пристап до овој ресурс',
  },
  [ExceptionCode.AUTHZ_TENANT_ACCESS_DENIED]: {
    en: 'You do not have access to this tenant',
    hr: 'Nemate pristup ovom klijentu',
    bs: 'Nemate pristup ovom klijentu',
    mk: 'Немате пристап до овој клиент',
  },
  [ExceptionCode.AUTHZ_ORGANIZATION_ACCESS_DENIED]: {
    en: 'You do not have access to this organization',
    hr: 'Nemate pristup ovoj organizaciji',
    bs: 'Nemate pristup ovoj organizaciji',
    mk: 'Немате пристап до оваа организација',
  },

  // Resource - Generic
  [ExceptionCode.RESOURCE_NOT_FOUND]: {
    en: 'The requested resource was not found',
    hr: 'Traženi resurs nije pronađen',
    bs: 'Traženi resurs nije pronađen',
    mk: 'Бараниот ресурс не е пронајден',
  },
  [ExceptionCode.RESOURCE_ALREADY_EXISTS]: {
    en: 'This resource already exists',
    hr: 'Ovaj resurs već postoji',
    bs: 'Ovaj resurs već postoji',
    mk: 'Овој ресурс веќе постои',
  },
  [ExceptionCode.RESOURCE_CONFLICT]: {
    en: 'A conflict occurred with the current state of the resource',
    hr: 'Došlo je do konflikta s trenutnim stanjem resursa',
    bs: 'Došlo je do konflikta s trenutnim stanjem resursa',
    mk: 'Настана конфликт со моменталната состојба на ресурсот',
  },
  [ExceptionCode.RESOURCE_GONE]: {
    en: 'This resource is no longer available',
    hr: 'Ovaj resurs više nije dostupan',
    bs: 'Ovaj resurs više nije dostupan',
    mk: 'Овој ресурс повеќе не е достапен',
  },
  [ExceptionCode.RESOURCE_LOCKED]: {
    en: 'This resource is currently locked',
    hr: 'Ovaj resurs je trenutno zaključan',
    bs: 'Ovaj resurs je trenutno zaključan',
    mk: 'Овој ресурс моментално е заклучен',
  },

  // Resource - Specific
  [ExceptionCode.USER_NOT_FOUND]: {
    en: 'User not found',
    hr: 'Korisnik nije pronađen',
    bs: 'Korisnik nije pronađen',
    mk: 'Корисникот не е пронајден',
  },
  [ExceptionCode.USER_ALREADY_EXISTS]: {
    en: 'A user with this email already exists',
    hr: 'Korisnik s ovom email adresom već postoji',
    bs: 'Korisnik s ovom email adresom već postoji',
    mk: 'Корисник со оваа е-пошта веќе постои',
  },
  [ExceptionCode.JOB_NOT_FOUND]: {
    en: 'Job posting not found',
    hr: 'Oglas za posao nije pronađen',
    bs: 'Oglas za posao nije pronađen',
    mk: 'Огласот за работа не е пронајден',
  },
  [ExceptionCode.JOB_EXPIRED]: {
    en: 'This job posting has expired',
    hr: 'Ovaj oglas za posao je istekao',
    bs: 'Ovaj oglas za posao je istekao',
    mk: 'Овој оглас за работа истече',
  },
  [ExceptionCode.JOB_CLOSED]: {
    en: 'This job posting is closed',
    hr: 'Ovaj oglas za posao je zatvoren',
    bs: 'Ovaj oglas za posao je zatvoren',
    mk: 'Овој оглас за работа е затворен',
  },
  [ExceptionCode.APPLICATION_NOT_FOUND]: {
    en: 'Application not found',
    hr: 'Prijava nije pronađena',
    bs: 'Prijava nije pronađena',
    mk: 'Апликацијата не е пронајдена',
  },
  [ExceptionCode.APPLICATION_ALREADY_EXISTS]: {
    en: 'You have already applied for this job',
    hr: 'Već ste se prijavili za ovaj posao',
    bs: 'Već ste se prijavili za ovaj posao',
    mk: 'Веќе аплициравте за оваа работа',
  },
  [ExceptionCode.ORGANIZATION_NOT_FOUND]: {
    en: 'Organization not found',
    hr: 'Organizacija nije pronađena',
    bs: 'Organizacija nije pronađena',
    mk: 'Организацијата не е пронајдена',
  },
  [ExceptionCode.TENANT_NOT_FOUND]: {
    en: 'Tenant not found',
    hr: 'Klijent nije pronađen',
    bs: 'Klijent nije pronađen',
    mk: 'Клиентот не е пронајден',
  },
  [ExceptionCode.FILE_NOT_FOUND]: {
    en: 'File not found',
    hr: 'Datoteka nije pronađena',
    bs: 'Datoteka nije pronađena',
    mk: 'Датотеката не е пронајдена',
  },
  [ExceptionCode.CATEGORY_NOT_FOUND]: {
    en: 'Category not found',
    hr: 'Kategorija nije pronađena',
    bs: 'Kategorija nije pronađena',
    mk: 'Категоријата не е пронајдена',
  },

  // Validation
  [ExceptionCode.VALIDATION_FAILED]: {
    en: 'Validation failed. Please check your input',
    hr: 'Validacija nije uspjela. Molimo provjerite unos',
    bs: 'Validacija nije uspjela. Molimo provjerite unos',
    mk: 'Валидацијата не успеа. Ве молиме проверете го вносот',
  },
  [ExceptionCode.VALIDATION_FIELD_REQUIRED]: {
    en: 'This field is required',
    hr: 'Ovo polje je obavezno',
    bs: 'Ovo polje je obavezno',
    mk: 'Ова поле е задолжително',
  },
  [ExceptionCode.VALIDATION_FIELD_INVALID]: {
    en: 'This field contains an invalid value',
    hr: 'Ovo polje sadrži nevažeću vrijednost',
    bs: 'Ovo polje sadrži nevažeću vrijednost',
    mk: 'Ова поле содржи невалидна вредност',
  },
  [ExceptionCode.VALIDATION_FIELD_TOO_SHORT]: {
    en: 'This field is too short',
    hr: 'Ovo polje je prekratko',
    bs: 'Ovo polje je prekratko',
    mk: 'Ова поле е премногу кратко',
  },
  [ExceptionCode.VALIDATION_FIELD_TOO_LONG]: {
    en: 'This field is too long',
    hr: 'Ovo polje je predugo',
    bs: 'Ovo polje je predugo',
    mk: 'Ова поле е премногу долго',
  },
  [ExceptionCode.VALIDATION_FIELD_FORMAT]: {
    en: 'This field has an invalid format',
    hr: 'Ovo polje ima nevažeći format',
    bs: 'Ovo polje ima nevažeći format',
    mk: 'Ова поле има невалиден формат',
  },
  [ExceptionCode.VALIDATION_EMAIL_INVALID]: {
    en: 'Please enter a valid email address',
    hr: 'Molimo unesite ispravnu email adresu',
    bs: 'Molimo unesite ispravnu email adresu',
    mk: 'Ве молиме внесете валидна е-пошта',
  },
  [ExceptionCode.VALIDATION_PHONE_INVALID]: {
    en: 'Please enter a valid phone number',
    hr: 'Molimo unesite ispravan broj telefona',
    bs: 'Molimo unesite ispravan broj telefona',
    mk: 'Ве молиме внесете валиден телефонски број',
  },
  [ExceptionCode.VALIDATION_URL_INVALID]: {
    en: 'Please enter a valid URL',
    hr: 'Molimo unesite ispravnu URL adresu',
    bs: 'Molimo unesite ispravnu URL adresu',
    mk: 'Ве молиме внесете валидна URL адреса',
  },
  [ExceptionCode.VALIDATION_DATE_INVALID]: {
    en: 'Please enter a valid date',
    hr: 'Molimo unesite ispravan datum',
    bs: 'Molimo unesite ispravan datum',
    mk: 'Ве молиме внесете валиден датум',
  },
  [ExceptionCode.VALIDATION_NUMBER_INVALID]: {
    en: 'Please enter a valid number',
    hr: 'Molimo unesite ispravan broj',
    bs: 'Molimo unesite ispravan broj',
    mk: 'Ве молиме внесете валиден број',
  },
  [ExceptionCode.VALIDATION_ENUM_INVALID]: {
    en: 'Please select a valid option',
    hr: 'Molimo odaberite ispravnu opciju',
    bs: 'Molimo odaberite ispravnu opciju',
    mk: 'Ве молиме изберете валидна опција',
  },
  [ExceptionCode.VALIDATION_ARRAY_INVALID]: {
    en: 'Please provide a valid list',
    hr: 'Molimo unesite ispravnu listu',
    bs: 'Molimo unesite ispravnu listu',
    mk: 'Ве молиме внесете валидна листа',
  },
  [ExceptionCode.VALIDATION_PASSWORD_WEAK]: {
    en: 'Password is too weak. Please use a stronger password',
    hr: 'Lozinka je preslaba. Molimo koristite jaču lozinku',
    bs: 'Lozinka je preslaba. Molimo koristite jaču lozinku',
    mk: 'Лозинката е премногу слаба. Ве молиме користете посилна лозинка',
  },
  [ExceptionCode.VALIDATION_PASSWORDS_MISMATCH]: {
    en: 'Passwords do not match',
    hr: 'Lozinke se ne podudaraju',
    bs: 'Lozinke se ne podudaraju',
    mk: 'Лозинките не се совпаѓаат',
  },

  // Rate Limiting
  [ExceptionCode.RATE_LIMIT_EXCEEDED]: {
    en: 'Rate limit exceeded. Please try again later',
    hr: 'Prekoračeno ograničenje zahtjeva. Molimo pokušajte kasnije',
    bs: 'Prekoračeno ograničenje zahtjeva. Molimo pokušajte kasnije',
    mk: 'Надминато ограничување на барања. Ве молиме обидете се подоцна',
  },
  [ExceptionCode.RATE_LIMIT_TOO_MANY_REQUESTS]: {
    en: 'Too many requests. Please slow down',
    hr: 'Previše zahtjeva. Molimo usporite',
    bs: 'Previše zahtjeva. Molimo usporite',
    mk: 'Премногу барања. Ве молиме забавете',
  },
  [ExceptionCode.RATE_LIMIT_QUOTA_EXCEEDED]: {
    en: 'API quota exceeded',
    hr: 'API kvota je prekoračena',
    bs: 'API kvota je prekoračena',
    mk: 'API квотата е надмината',
  },

  // Payment
  [ExceptionCode.PAYMENT_REQUIRED]: {
    en: 'Payment is required to continue',
    hr: 'Potrebno je plaćanje za nastavak',
    bs: 'Potrebno je plaćanje za nastavak',
    mk: 'Потребно е плаќање за да продолжите',
  },
  [ExceptionCode.PAYMENT_FAILED]: {
    en: 'Payment failed. Please try again',
    hr: 'Plaćanje nije uspjelo. Molimo pokušajte ponovo',
    bs: 'Plaćanje nije uspjelo. Molimo pokušajte ponovo',
    mk: 'Плаќањето не успеа. Ве молиме обидете се повторно',
  },
  [ExceptionCode.PAYMENT_DECLINED]: {
    en: 'Payment was declined',
    hr: 'Plaćanje je odbijeno',
    bs: 'Plaćanje je odbijeno',
    mk: 'Плаќањето беше одбиено',
  },
  [ExceptionCode.PAYMENT_INSUFFICIENT_FUNDS]: {
    en: 'Insufficient funds',
    hr: 'Nedovoljno sredstava',
    bs: 'Nedovoljno sredstava',
    mk: 'Недоволно средства',
  },
  [ExceptionCode.SUBSCRIPTION_EXPIRED]: {
    en: 'Your subscription has expired',
    hr: 'Vaša pretplata je istekla',
    bs: 'Vaša pretplata je istekla',
    mk: 'Вашата претплата истече',
  },
  [ExceptionCode.SUBSCRIPTION_REQUIRED]: {
    en: 'A subscription is required for this feature',
    hr: 'Za ovu funkcionalnost potrebna je pretplata',
    bs: 'Za ovu funkcionalnost potrebna je pretplata',
    mk: 'Потребна е претплата за оваа функционалност',
  },

  // File/Upload
  [ExceptionCode.FILE_TOO_LARGE]: {
    en: 'File is too large',
    hr: 'Datoteka je prevelika',
    bs: 'Datoteka je prevelika',
    mk: 'Датотеката е премногу голема',
  },
  [ExceptionCode.FILE_TYPE_NOT_ALLOWED]: {
    en: 'This file type is not allowed',
    hr: 'Ovaj tip datoteke nije dozvoljen',
    bs: 'Ovaj tip datoteke nije dozvoljen',
    mk: 'Овој тип на датотека не е дозволен',
  },
  [ExceptionCode.FILE_UPLOAD_FAILED]: {
    en: 'File upload failed',
    hr: 'Prijenos datoteke nije uspio',
    bs: 'Prijenos datoteke nije uspio',
    mk: 'Прикачувањето на датотеката не успеа',
  },
  [ExceptionCode.FILE_CORRUPTED]: {
    en: 'File appears to be corrupted',
    hr: 'Datoteka izgleda oštećeno',
    bs: 'Datoteka izgleda oštećeno',
    mk: 'Датотеката изгледа оштетена',
  },

  // External Services
  [ExceptionCode.EXTERNAL_SERVICE_ERROR]: {
    en: 'An external service error occurred',
    hr: 'Došlo je do greške vanjske usluge',
    bs: 'Došlo je do greške vanjske usluge',
    mk: 'Настана грешка на надворешна услуга',
  },
  [ExceptionCode.EXTERNAL_SERVICE_TIMEOUT]: {
    en: 'External service request timed out',
    hr: 'Zahtjev prema vanjskoj usluzi je istekao',
    bs: 'Zahtjev prema vanjskoj usluzi je istekao',
    mk: 'Барањето до надворешната услуга истече',
  },
  [ExceptionCode.EXTERNAL_SERVICE_UNAVAILABLE]: {
    en: 'External service is currently unavailable',
    hr: 'Vanjska usluga trenutno nije dostupna',
    bs: 'Vanjska usluga trenutno nije dostupna',
    mk: 'Надворешната услуга моментално не е достапна',
  },

  // Internal
  [ExceptionCode.INTERNAL_ERROR]: {
    en: 'An unexpected error occurred. Please try again later',
    hr: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo kasnije',
    bs: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo kasnije',
    mk: 'Се случи неочекувана грешка. Ве молиме обидете се повторно подоцна',
  },
  [ExceptionCode.INTERNAL_DATABASE_ERROR]: {
    en: 'A database error occurred',
    hr: 'Došlo je do greške baze podataka',
    bs: 'Došlo je do greške baze podataka',
    mk: 'Настана грешка во базата на податоци',
  },
  [ExceptionCode.INTERNAL_CONFIGURATION_ERROR]: {
    en: 'A configuration error occurred',
    hr: 'Došlo je do greške konfiguracije',
    bs: 'Došlo je do greške konfiguracije',
    mk: 'Настана грешка во конфигурацијата',
  },
  [ExceptionCode.MAINTENANCE_MODE]: {
    en: 'The system is currently under maintenance. Please try again later',
    hr: 'Sustav je trenutno u održavanju. Molimo pokušajte ponovo kasnije',
    bs: 'Sistem je trenutno u održavanju. Molimo pokušajte ponovo kasnije',
    mk: 'Системот моментално е во одржување. Ве молиме обидете се повторно подоцна',
  },
};
