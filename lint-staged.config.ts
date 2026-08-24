import type {Configuration} from 'lint-staged';

export default ({
  '*': ((): string => 'secretlint "**/*"'),
  './**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,json,md,html,css,scss}': ((): string => 'tt verify')
} satisfies Configuration);
