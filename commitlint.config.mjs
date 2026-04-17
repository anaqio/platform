export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'test',
        'chore',
        'docs',
        'db',
        'style',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
  },
}
