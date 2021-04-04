module.exports = { // eslint-disable-line
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {

    // TO FIX -> ESLint: Cannot read property 'loc' of undefined.
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2, {
      'SwitchCase': 1
    }],
    // --END

    // 行末不用分号
    'semi':
      ['error', 'never'],

    // 字符串使用单引号，允许字符串使用反勾号
    'quotes':
      ['error', 'single', { 'allowTemplateLiterals': true }],

    // 块区域前后时刻保留大括号
    'curly':
      'error',

    // switch 语句中必须包含 default 分支
    'default-case':
      'error',

    // 点操作符和属性放在同一行
    'dot-location':
      ['error', 'property'],

    // === !==
    'eqeqeq':
      'error',

    // 不出现空函数
    'no-empty-function':
      'error',

    // 不出现多个空格
    'no-multi-spaces':
      'error',

    // 不多行字符串
    'no-multi-str':
      'error',

    // 数组格式
    'array-bracket-spacing':
      ['error', 'never'],

    // 代码块大括号风格
    'block-spacing':
      'error',

    // 代码块大括号风格
    'brace-style':
      'error',

    // 使用骆驼拼写法
    'camelcase':
      'error',

    // 逗号前后的空格风格
    'comma-spacing':
      ['error', { 'before': false, 'after': true }],

    // 文件末尾存在空行
    'eol-last':
      ['error', 'always'],

    // 关键字之前至少有一个空格，关键字之后至少有一个空格
    'keyword-spacing':
      ['error', { 'before': true, 'after': true }],

    // 行末不出现空格
    'no-trailing-spaces':
      'error',

    // 函数圆括号之前有一个空格
    'space-before-function-paren':
      'error',

    // 操作符周围有空格
    'space-infix-ops':
      'error',

    // 不能使用var声明
    'no-var':
      'error',
  }
}
