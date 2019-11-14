// module.exports = {
//   root: true,

//   parserOptions: {
//     parser: 'babel-eslint',
//     sourceType: 'module'
//   },

//   env: {
//     browser: true
//   },

//   extends: [
//     // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
//     // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
//     'plugin:vue/essential',
//     '@vue/standard'
//   ],

//   // required to lint *.vue files
//   plugins: [
//     'vue'
//   ],

//   globals: {
//     'ga': true, // Google Analytics
//     'cordova': true,
//     '__statics': true,
//     'process': true,
//     'Capacitor': true,
//     'chrome': true
//   },

//   // add your custom rules here
//   rules: {
//     // allow async-await
//     'generator-star-spacing': 'off',
//     // allow paren-less arrow functions
//     'arrow-parens': 'off',
//     'one-var': 'off',

//     'import/first': 'off',
//     'import/named': 'error',
//     'import/namespace': 'error',
//     'import/default': 'error',
//     'import/export': 'error',
//     'import/extensions': 'off',
//     'import/no-unresolved': 'off',
//     'import/no-extraneous-dependencies': 'off',
//     'prefer-promise-reject-errors': 'off',

//     // allow debugger during development only
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
//   }
// }
// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

