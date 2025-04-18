const { validateEmail } = require('../utils');

test('валидный email', () => {
  expect(validateEmail('user@example.com')).toBe(true);
});

test('невалидный email', () => {
  expect(validateEmail('bad-email')).toBe(false);
});
