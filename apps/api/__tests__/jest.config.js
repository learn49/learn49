module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  rootDir: '.',
  moduleNameMapper: {
    '@/modules/(.*)': '<rootDir>/../src/modules/$1',
    '@/utils/(.*)': '<rootDir>/../src/utils/$1',
    '@/services/(.*)': '<rootDir>/../src/services/$1',
    '@/auth/(.*)': '<rootDir>/../src/auth/$1',
    '@/sentry.interceptor': '<rootDir>/../src/sentry.interceptor',
  },
  modulePaths: ['<rootDir>'],
};
