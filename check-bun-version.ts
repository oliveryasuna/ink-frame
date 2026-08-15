import process from 'node:process';

const required = (await Bun.file('.bun-version').text()).trim();
const actual = Bun.version;

if(required !== actual) {
  console.error(`Bun ${required} required, but ${actual} is installed.`);
  // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit -- This is a check script.
  process.exit(1);
}

// eslint-disable-next-line unicorn/require-module-specifiers -- This is a check script.
export {};
