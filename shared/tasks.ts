import type {DepList, OptionsSpec, TaskContext, TaskDef} from '@oliveryasuna/ts-task';
import {type as input, opt} from '@oliveryasuna/ts-task';
import {sh} from './helpers';

const typecheckDef = (({
  name: 'typecheck',
  description: 'Type-check with tsc',
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

    ctx.log.info(`${ctx.input.project} type-checks`);
  })
} as const) satisfies TaskDef<'typecheck', void, [], Record<string, never>, {project: string;}>);

// The def a factory produces: the base's fixed parts plus the per-call deps.
interface MadeDef<
  TName extends string,
  TOpts extends OptionsSpec,
  TDeps extends DepList
> {
  name: TName;
  description?: string;
  options?: TOpts;
  deps: TDeps;
  run(ctx: TaskContext<TDeps, TOpts, void>): void;
}

// Two call signatures rather than one optional-`deps` generic: a single
// `<const TDeps = readonly []>(def?: {deps?: TDeps})` will not resolve `TDeps`
// to its default when `deps` is empty or absent -- it collapses to the
// `DepList` constraint, which then trips the `__unboundDependency` check. The
// no-deps overload pins `readonly []` directly; the other infers concrete deps.
interface DefFactory<
  TName extends string,
  TOpts extends OptionsSpec
> {
  (def?: {deps?: undefined;}): MadeDef<TName, TOpts, (readonly [])>;
  <const TDeps extends DepList>(def: {deps: TDeps;}): MadeDef<TName, TOpts, TDeps>;
}

// Capture a task's fixed parts (name, description, options, run) and return a
// `({deps}) => def` factory, so each package supplies its own deps while
// sharing everything else. The reusable version of the `makeBuildDef` pattern.
const makeDefFactory = (<
  const TName extends string,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Intentional.
  TOpts extends OptionsSpec = {}
>(base: TaskDef<TName, void, [], TOpts, void>): DefFactory<TName, TOpts> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe.
  (((def: {deps?: DepList;} = {}) => ({
    name: base.name,
    description: base.description,
    options: base.options,
    deps: (def.deps ?? []),
    run: base.run
  })) as DefFactory<TName, TOpts>));

const buildDefFactory = makeDefFactory({
  name: 'build',
  description: 'Bundle with tsdown',
  run: (async(ctx): Promise<void> => {
    await sh(ctx, 'tsdown');

    ctx.log.info('bundled');
  })
});

const lintDefFactory = makeDefFactory({
  name: 'lint',
  description: 'Run ESLint',
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

const testDefFactory = makeDefFactory({
  name: 'test',
  description: 'Run tests with bun',
  run: (async(ctx): Promise<void> => {
    await sh(ctx, 'bun', ['test']);

    ctx.log.info('tests passed');
  })
});

const verifyDefFactory = makeDefFactory({
  name: 'verify',
  description: 'Verify the project',
  run: (async(ctx): Promise<void> => {
    ctx.log.info('all checks passed');
  })
});

const ciDefFactory = makeDefFactory({
  name: 'ci',
  description: 'Run CI checks',
  run: (async(ctx): Promise<void> => {
    ctx.log.info('all checks passed');
  })
});

export {
  typecheckDef,
  lintDefFactory,
  buildDefFactory,
  testDefFactory,
  verifyDefFactory,
  ciDefFactory
};
