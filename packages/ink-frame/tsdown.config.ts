import {defineConfig} from '@oliveryasuna/tsdown-config';

export default defineConfig(
  'library',
  {
    tsconfig: 'tsconfig.build.json',
    format: 'esm'
  }
);
