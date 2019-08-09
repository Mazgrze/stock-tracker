import { cleanKey } from './utils';

test('should clean', () => {
  expect(cleanKey('10. fooBar')).toBe('fooBar');
});


test('should camelCase', () => {
  expect(cleanKey('foo bar')).toBe('fooBar');
});
