/** @type {import("eslint").Linter.Config} */
const config = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'next/core-web-vitals',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
	],
	rules: {
		'@typescript-eslint/consistent-type-imports': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				checksVoidReturn: { attributes: false },
			},
		],
		'@typescript-eslint/no-empty-interface': 'warn',
		'@typescript-eslint/no-empty-function': 'warn',
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'react-hooks/exhaustive-deps': 'off',
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'array',
			},
		],
	},
}

module.exports = config
