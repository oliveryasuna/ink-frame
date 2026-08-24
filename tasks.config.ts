import {defineConfig, task} from '@oliveryasuna/ts-task';
import {mergeTasks} from '@oliveryasuna/ts-task-merge-tasks';
import {summaryReporter} from '@oliveryasuna/ts-task-summary';
import {sh} from './shared/helpers';

//==================================================
// Tasks
//==================================================

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
    checkBun,
    checkPkg
  ],
  run: (async(ctx): Promise<void> => {
    ctx.log.info('all checks passed');
  })
});

export default defineConfig({
  plugins: [
    summaryReporter(),
    (await mergeTasks(
      'packages/ink-frame/tasks.config.ts',
      'packages/ink-frame-scroll/tasks.config.ts'
    ))
  ],
  tasks: [
    checkBun,
    checkPkg,
    formatPkg,
    verify
  ],
  defaultTask: 'verify'
});
