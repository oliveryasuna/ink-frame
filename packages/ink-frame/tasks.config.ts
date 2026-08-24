import {defineConfig, namespace} from '@oliveryasuna/ts-task';
import {buildDefFactory, ciDefFactory, lintDefFactory, typecheckDef, verifyDefFactory} from '../../shared/tasks';

const typecheck = namespace('ink-frame').task(typecheckDef);

const build = namespace('ink-frame').task(buildDefFactory({deps: [typecheck.with({project: 'tsconfig.build.json'})]}));

const lint = namespace('ink-frame').task(lintDefFactory());

const verify = namespace('ink-frame').task(verifyDefFactory({
  deps: [
    lint,
    typecheck.with({project: 'tsconfig.build.json'}),
    build
  ]
}));

const ci = namespace('ink-frame').task(ciDefFactory({deps: [verify]}));

const prepack = namespace('ink-frame').task({
  name: 'prepack',
  description: 'Prepare the package for publication',
  deps: [verify],
  run: ((ctx) => {
    ctx.log.info('package prepared for publication');
  })
});

export default defineConfig({
  tasks: [
    build,
    lint,
    verify,
    ci,
    prepack
  ],
  defaultTask: 'ink-frame:verify'
});
export {
  build
};
