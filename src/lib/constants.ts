export const languages = [
  { code: 'uz', short: 'UZ', label: "O'zbekcha" },
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'kaa', short: 'QR', label: 'Qaraqalpaqsha' },
] as const;

export type LangCode = typeof languages[number]['code'];
