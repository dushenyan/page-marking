import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  rules: {
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off',
  },
})
