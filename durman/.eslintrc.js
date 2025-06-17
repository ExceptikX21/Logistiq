// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   'extends': [
//     'plugin:vue/vue3-essential',
//     'eslint:recommended'
//   ],
//   parserOptions: {
//     parser: '@babel/eslint-parser'
//   },
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-undef': 'off', // Desactiva la regla no-undef que genera el error
//   }
// }
module.exports = {
  root: true,
  env: {
    node: true,
    // Aseguramos que ESLint conozca los entornos de Vue
    'vue/setup-compiler-macros': true,
    "browser": true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  // Solo muestra error en casos de `typeof`
  },
  "globals": {
    "webkitSpeechRecognition": "readonly"
  }
}
