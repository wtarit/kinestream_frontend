import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/app"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(svg|png|jpg|jpeg|gif)$": "<rootDir>/app/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/app/__setup__/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};

export default config;
