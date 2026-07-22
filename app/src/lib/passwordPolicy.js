// Standard printable-ASCII punctuation set (everything that isn't a letter
// or digit). Checked via string membership rather than a regex character
// class to avoid escaping pitfalls with `]`, `\`, and `-` inside `[...]`.
const SPECIAL_CHARS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

export const PASSWORD_RULES = [
  { id: 'length', label: '8–12 characters', test: (pw) => pw.length >= 8 && pw.length <= 12 },
  { id: 'digit', label: 'At least one number', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'At least one special character', test: (pw) => [...pw].some((ch) => SPECIAL_CHARS.includes(ch)) },
  { id: 'noRepeat', label: 'No character repeated twice in a row', test: (pw) => !/(.)\1/.test(pw) },
];

/** Returns an array of failing-rule labels. Empty array means valid. */
export function validatePassword(password) {
  return PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label);
}
