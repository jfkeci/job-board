import type { SupportedLanguage } from '../types';

type MessageRecord = Record<SupportedLanguage, string>;

export const validationMessages: Record<string, MessageRecord> = {
  // Required
  required: {
    en: '{{field}} is required',
    hr: '{{field}} je obavezno polje',
    bs: '{{field}} je obavezno polje',
    mk: '{{field}} е задолжително поле',
  },
  isNotEmpty: {
    en: '{{field}} should not be empty',
    hr: '{{field}} ne smije biti prazno',
    bs: '{{field}} ne smije biti prazno',
    mk: '{{field}} не смее да биде празно',
  },
  isDefined: {
    en: '{{field}} must be defined',
    hr: '{{field}} mora biti definirano',
    bs: '{{field}} mora biti definirano',
    mk: '{{field}} мора да биде дефинирано',
  },

  // String length
  minLength: {
    en: '{{field}} must be at least {{min}} characters',
    hr: '{{field}} mora imati najmanje {{min}} znakova',
    bs: '{{field}} mora imati najmanje {{min}} znakova',
    mk: '{{field}} мора да има најмалку {{min}} карактери',
  },
  maxLength: {
    en: '{{field}} must not exceed {{max}} characters',
    hr: '{{field}} ne smije imati više od {{max}} znakova',
    bs: '{{field}} ne smije imati više od {{max}} znakova',
    mk: '{{field}} не смее да надмине {{max}} карактери',
  },
  length: {
    en: '{{field}} must be between {{min}} and {{max}} characters',
    hr: '{{field}} mora imati između {{min}} i {{max}} znakova',
    bs: '{{field}} mora imati između {{min}} i {{max}} znakova',
    mk: '{{field}} мора да има помеѓу {{min}} и {{max}} карактери',
  },

  // String format
  isEmail: {
    en: 'Please enter a valid email address',
    hr: 'Molimo unesite ispravnu email adresu',
    bs: 'Molimo unesite ispravnu email adresu',
    mk: 'Ве молиме внесете валидна е-пошта',
  },
  isUrl: {
    en: 'Please enter a valid URL',
    hr: 'Molimo unesite ispravnu URL adresu',
    bs: 'Molimo unesite ispravnu URL adresu',
    mk: 'Ве молиме внесете валидна URL адреса',
  },
  isPhoneNumber: {
    en: 'Please enter a valid phone number',
    hr: 'Molimo unesite ispravan broj telefona',
    bs: 'Molimo unesite ispravan broj telefona',
    mk: 'Ве молиме внесете валиден телефонски број',
  },
  isUUID: {
    en: '{{field}} must be a valid UUID',
    hr: '{{field}} mora biti ispravan UUID',
    bs: '{{field}} mora biti ispravan UUID',
    mk: '{{field}} мора да биде валиден UUID',
  },
  isAlpha: {
    en: '{{field}} must contain only letters',
    hr: '{{field}} mora sadržavati samo slova',
    bs: '{{field}} mora sadržavati samo slova',
    mk: '{{field}} мора да содржи само букви',
  },
  isAlphanumeric: {
    en: '{{field}} must contain only letters and numbers',
    hr: '{{field}} mora sadržavati samo slova i brojeve',
    bs: '{{field}} mora sadržavati samo slova i brojeve',
    mk: '{{field}} мора да содржи само букви и бројки',
  },
  matches: {
    en: '{{field}} format is invalid',
    hr: 'Format polja {{field}} nije ispravan',
    bs: 'Format polja {{field}} nije ispravan',
    mk: 'Форматот на {{field}} не е валиден',
  },

  // Numbers
  isNumber: {
    en: '{{field}} must be a number',
    hr: '{{field}} mora biti broj',
    bs: '{{field}} mora biti broj',
    mk: '{{field}} мора да биде број',
  },
  isInt: {
    en: '{{field}} must be an integer',
    hr: '{{field}} mora biti cijeli broj',
    bs: '{{field}} mora biti cijeli broj',
    mk: '{{field}} мора да биде цел број',
  },
  isPositive: {
    en: '{{field}} must be a positive number',
    hr: '{{field}} mora biti pozitivan broj',
    bs: '{{field}} mora biti pozitivan broj',
    mk: '{{field}} мора да биде позитивен број',
  },
  isNegative: {
    en: '{{field}} must be a negative number',
    hr: '{{field}} mora biti negativan broj',
    bs: '{{field}} mora biti negativan broj',
    mk: '{{field}} мора да биде негативен број',
  },
  min: {
    en: '{{field}} must be at least {{min}}',
    hr: '{{field}} mora biti najmanje {{min}}',
    bs: '{{field}} mora biti najmanje {{min}}',
    mk: '{{field}} мора да биде најмалку {{min}}',
  },
  max: {
    en: '{{field}} must not exceed {{max}}',
    hr: '{{field}} ne smije biti veći od {{max}}',
    bs: '{{field}} ne smije biti veći od {{max}}',
    mk: '{{field}} не смее да надмине {{max}}',
  },

  // Date
  isDate: {
    en: '{{field}} must be a valid date',
    hr: '{{field}} mora biti ispravan datum',
    bs: '{{field}} mora biti ispravan datum',
    mk: '{{field}} мора да биде валиден датум',
  },
  isDateString: {
    en: '{{field}} must be a valid date string',
    hr: '{{field}} mora biti ispravan tekstualni datum',
    bs: '{{field}} mora biti ispravan tekstualni datum',
    mk: '{{field}} мора да биде валиден текстуален датум',
  },
  minDate: {
    en: '{{field}} must be after {{date}}',
    hr: '{{field}} mora biti nakon {{date}}',
    bs: '{{field}} mora biti nakon {{date}}',
    mk: '{{field}} мора да биде после {{date}}',
  },
  maxDate: {
    en: '{{field}} must be before {{date}}',
    hr: '{{field}} mora biti prije {{date}}',
    bs: '{{field}} mora biti prije {{date}}',
    mk: '{{field}} мора да биде пред {{date}}',
  },

  // Boolean
  isBoolean: {
    en: '{{field}} must be a boolean value',
    hr: '{{field}} mora biti boolean vrijednost',
    bs: '{{field}} mora biti boolean vrijednost',
    mk: '{{field}} мора да биде булова вредност',
  },

  // Enum
  isEnum: {
    en: '{{field}} must be one of the allowed values',
    hr: '{{field}} mora biti jedna od dozvoljenih vrijednosti',
    bs: '{{field}} mora biti jedna od dozvoljenih vrijednosti',
    mk: '{{field}} мора да биде една од дозволените вредности',
  },

  // Array
  isArray: {
    en: '{{field}} must be an array',
    hr: '{{field}} mora biti niz',
    bs: '{{field}} mora biti niz',
    mk: '{{field}} мора да биде низа',
  },
  arrayMinSize: {
    en: '{{field}} must contain at least {{min}} items',
    hr: '{{field}} mora sadržavati najmanje {{min}} stavki',
    bs: '{{field}} mora sadržavati najmanje {{min}} stavki',
    mk: '{{field}} мора да содржи најмалку {{min}} ставки',
  },
  arrayMaxSize: {
    en: '{{field}} must not contain more than {{max}} items',
    hr: '{{field}} ne smije sadržavati više od {{max}} stavki',
    bs: '{{field}} ne smije sadržavati više od {{max}} stavki',
    mk: '{{field}} не смее да содржи повеќе од {{max}} ставки',
  },
  arrayUnique: {
    en: '{{field}} must contain unique values',
    hr: '{{field}} mora sadržavati jedinstvene vrijednosti',
    bs: '{{field}} mora sadržavati jedinstvene vrijednosti',
    mk: '{{field}} мора да содржи уникатни вредности',
  },

  // Object
  isObject: {
    en: '{{field}} must be an object',
    hr: '{{field}} mora biti objekt',
    bs: '{{field}} mora biti objekt',
    mk: '{{field}} мора да биде објект',
  },
  isNotEmptyObject: {
    en: '{{field}} must not be an empty object',
    hr: '{{field}} ne smije biti prazan objekt',
    bs: '{{field}} ne smije biti prazan objekt',
    mk: '{{field}} не смее да биде празен објект',
  },

  // Custom/Application specific
  isStrongPassword: {
    en: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    hr: 'Lozinka mora sadržavati najmanje 8 znakova, jedno veliko slovo, jedno malo slovo, jedan broj i jedan poseban znak',
    bs: 'Lozinka mora sadržavati najmanje 8 znakova, jedno veliko slovo, jedno malo slovo, jedan broj i jedan poseban znak',
    mk: 'Лозинката мора да содржи најмалку 8 карактери, една голема буква, една мала буква, еден број и еден специјален знак',
  },
  passwordsMatch: {
    en: 'Passwords do not match',
    hr: 'Lozinke se ne podudaraju',
    bs: 'Lozinke se ne podudaraju',
    mk: 'Лозинките не се совпаѓаат',
  },

  // Generic fallback
  default: {
    en: '{{field}} is invalid',
    hr: '{{field}} nije ispravno',
    bs: '{{field}} nije ispravno',
    mk: '{{field}} не е валидно',
  },
};

export const fieldNameTranslations: Record<string, Record<SupportedLanguage, string>> = {
  email: {
    en: 'Email',
    hr: 'Email',
    bs: 'Email',
    mk: 'Е-пошта',
  },
  password: {
    en: 'Password',
    hr: 'Lozinka',
    bs: 'Lozinka',
    mk: 'Лозинка',
  },
  confirmPassword: {
    en: 'Confirm password',
    hr: 'Potvrdi lozinku',
    bs: 'Potvrdi lozinku',
    mk: 'Потврди лозинка',
  },
  firstName: {
    en: 'First name',
    hr: 'Ime',
    bs: 'Ime',
    mk: 'Име',
  },
  lastName: {
    en: 'Last name',
    hr: 'Prezime',
    bs: 'Prezime',
    mk: 'Презиме',
  },
  phone: {
    en: 'Phone number',
    hr: 'Broj telefona',
    bs: 'Broj telefona',
    mk: 'Телефонски број',
  },
  address: {
    en: 'Address',
    hr: 'Adresa',
    bs: 'Adresa',
    mk: 'Адреса',
  },
  city: {
    en: 'City',
    hr: 'Grad',
    bs: 'Grad',
    mk: 'Град',
  },
  country: {
    en: 'Country',
    hr: 'Država',
    bs: 'Država',
    mk: 'Држава',
  },
  title: {
    en: 'Title',
    hr: 'Naslov',
    bs: 'Naslov',
    mk: 'Наслов',
  },
  description: {
    en: 'Description',
    hr: 'Opis',
    bs: 'Opis',
    mk: 'Опис',
  },
  name: {
    en: 'Name',
    hr: 'Naziv',
    bs: 'Naziv',
    mk: 'Име',
  },
};
