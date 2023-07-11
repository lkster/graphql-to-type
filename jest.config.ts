import { Config } from 'jest';

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    roots: ['spec'],
    transformIgnorePatterns: ['^.+\\.js$'],
    watchPathIgnorePatterns: [
        'node_modules',
    ],
} as Config;
