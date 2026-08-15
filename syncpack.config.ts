import type {RcFile} from 'syncpack';

export default ({
  formatBugs: true,
  formatRepository: false,
  indent: '  ',
  semverGroups: [
    {
      dependencyTypes: [
        'prod',
        'dev'
      ],
      range: '',
      dependencies: ['**'],
      packages: ['**']
    },
    {
      dependencyTypes: ['peer'],
      range: '^',
      dependencies: ['^**'],
      packages: ['**']
    }
  ],
  sortAz: [
    'bin',
    'contributors',
    'dependencies',
    'devDependencies',
    'keywords',
    'peerDependencies',
    'resolutions',
    'scripts'
  ],
  sortExports: [
    'types',
    'node',
    'browser',
    'import',
    'require',
    'development',
    'production',
    'default'
  ],
  sortFirst: [
    '$schema',
    'name',
    'private',
    'version',
    'license',
    'description',
    'homepage',
    'author',
    'contributors',
    'repository',
    'bugs',
    'keywords',
    'engineStrict',
    'engines',
    'packageManager',
    'type',
    'bin',
    'main',
    'module',
    'types',
    'exports',
    'files',
    'scripts',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta'
  ],
  sortPackages: true,
  versionGroups: [
    {
      label: '@types packages should only be under devDependencies',
      dependencies: ['@types/**'],
      dependencyTypes: ['!dev'],
      isBanned: true
    },
    {
      label: 'Local packages should be pinned to workspace:*',
      dependencies: ['$LOCAL'],
      dependencyTypes: [
        'prod',
        'dev'
      ],
      packages: ['**'],
      pinVersion: 'workspace:*'
    }
  ]
} satisfies RcFile);
