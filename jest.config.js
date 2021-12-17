/* eslint-disable filenames/match-regex */
module.exports = {
  // preset: Object.assign(
  //   ts_preset, 
  //   puppeteer_preset,
  // ),
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src',
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
  modulePathIgnorePatterns: ['<rootDir>/tests/package'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};