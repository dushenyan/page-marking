import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',

  vue: true,

  typescript: true,
}, {
  files: ['**/*.vue'],
  rules: {
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off',
  },
})
