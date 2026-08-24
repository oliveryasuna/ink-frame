import {defineConfig} from '@oliveryasuna/eslint-config';

export default defineConfig(
  {
    ignores: (defaults => [
      ...defaults,
      'README.md',
      '*git-ignore*'
    ]),
    javascript: {globals: {Bun: 'readonly'}},
    jsonc: false,
    react: true,
    typescript: {
      typeAware: true,
      tsconfigRootDir: import.meta.dirname
    }
  },
  {
    files: ['./**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }
);
