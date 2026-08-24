import {defineConfig, inDir, namespace} from '@oliveryasuna/ts-task';
import path from 'node:path';
import {build as buildInkFrame} from '../../packages/ink-frame/tasks.config';
import {buildDefFactory, ciDefFactory, lintDefFactory, testDefFactory, typecheckDef, verifyDefFactory} from '../../shared/tasks';

const typecheck = namespace('ink-frame-layout').task(typecheckDef);

const build = namespace('ink-frame-layout').task(buildDefFactory({
  deps: [
    typecheck.with({project: 'tsconfig.build.json'}),
    inDir(path.resolve(import.meta.dirname, '../../packages/ink-frame'), buildInkFrame)
  ]
}));

const lint = namespace('ink-frame-layout').task(lintDefFactory());

const test = namespace('ink-frame-layout').task(testDefFactory());

const verify = namespace('ink-frame-layout').task(verifyDefFactory({
  deps: [
    lint,
    typecheck.with({project: 'tsconfig.build.json'}),
    test,
    build
  ]
}));

const ci = namespace('ink-frame-layout').task(ciDefFactory({deps: [verify]}));

const prepack = namespace('ink-frame-layout').task({
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
    test,
    verify,
    ci,
    prepack
  ],
  defaultTask: 'ink-frame-layout:verify'
});
export {
  build
};
