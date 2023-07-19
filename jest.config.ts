import { Config } from 'jest';

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    roots: ['src', 'spec'],
    transformIgnorePatterns: ['^.+\\.js$'],
    watchPathIgnorePatterns: [
        'node_modules',
    ],
} as Config;
