import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',

  vue: true,

  typescript: true,
}, {
  files: ['**/*'],
  rules: {
    'no-console': 'off',
    'vue/multi-word-component-names': 'off',
    'unused-imports/no-unused-vars': 'off',
    'ts/ban-ts-comment': 'off',
  },
})
