import type {Configuration} from 'lint-staged';

export default ({
  '*': ['secretlint "**/*"'],
  'src/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,json,md,html,css,scss}': ['bun run lint']
} satisfies Configuration);
