import type {ExecResult, Logger} from '@oliveryasuna/ts-task';
import {defineConfig, type as input, opt, task} from '@oliveryasuna/ts-task';
import {summaryReporter} from '@oliveryasuna/ts-task-summary';

//==================================================
// Helpers
//==================================================

const sh = (async(
  ctx: {
    log: Logger;
    exec(c: string, a?: (readonly string[])): Promise<ExecResult>;
  },
  command: string,
  args: (readonly string[]) = []
): Promise<ExecResult> => {
  const result = (await ctx.exec(command, args));
  if(result.code !== 0) {
    if(result.stdout.trim()) {
      ctx.log.info(result.stdout.trimEnd());
    }
    if(result.stderr.trim()) {
      ctx.log.error(result.stderr.trimEnd());
    }

    throw (new Error(`${[command, ...args].join(' ')} exited ${result.code}`));
  }

  return result;
});

//==================================================
// Tasks
//==================================================

const typecheck = task({
  name: 'typecheck',
  input: input<{project: string;}>(),
  identity: (i => i.project),
  run: (async(ctx): Promise<void> => {
    await sh(
      ctx,
      'tsc',
      [
        '--noEmit',
        '--project',
        ctx.input.project
      ]
    );
  })
});

const build = task({
  name: 'build',
  deps: [typecheck.with({project: 'tsconfig.build.json'})],
  run: (async(ctx): Promise<void> => {
    await sh(ctx, 'tsdown');

    ctx.log.info('bundled');
  })
});

const lint = task({
  name: 'lint',
  options: {
    fix: opt.boolean().describe('Apply autofixes').alias('f'),
    'max-warnings': opt.number().default(0).describe('Warnings tolerated before failing')
  },
  run: (async(ctx): Promise<void> => {
    await sh(
      ctx,
      'eslint',
      [
        ...(ctx.options.fix ? ['--fix'] : []),
        '--max-warnings',
        String(ctx.options['max-warnings'])
      ]
    );

    ctx.log.info(ctx.options.fix ? 'linted and fixed' : 'lint clean');
  })
});

const checkBun = task({
  name: 'check-bun',
  run: (async(ctx): Promise<void> => {
    await sh(
      ctx,
      'bun',
      [
        'run',
        './check-bun-version.ts'
      ]
    );

    ctx.log.info('bun version is up to date');
  })
});

const checkPkg = task({
  name: 'check-pkg',
  run: (async(ctx): Promise<void> => {
    await sh(
      ctx,
      'syncpack',
      [
        'format',
        '--check'
      ]
    );

    ctx.log.info('package.json is clean');
  })
});

const formatPkg = task({
  name: 'format-pkg',
  run: (async(ctx): Promise<void> => {
    await sh(ctx, 'syncpack', ['format']);

    ctx.log.info('package.json formatted');
  })
});

const verify = task({
  name: 'verify',
  deps: [
    build,
    lint,
    checkBun,
    checkPkg
  ],
  run: (async(ctx): Promise<void> => {
    ctx.log.info('all checks passed');
  })
});

const ci = task({
  name: 'ci',
  deps: [
    lint,
    build
  ],
  run: (async(ctx): Promise<void> => {
    ctx.log.info('all checks passed');
  })
});

const prepack = task({
  name: 'prepack',
  deps: [verify],
  run: (async(ctx): Promise<void> => {
    ctx.log.info('package ready to publish');
  })
});

export default defineConfig({
  plugins: [summaryReporter()],
  tasks: [
    build,
    lint,
    checkBun,
    checkPkg,
    formatPkg,
    verify,
    ci,
    prepack
  ],
  defaultTask: 'verify'
});
