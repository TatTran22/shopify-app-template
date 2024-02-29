module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript',
        'eslint-config-prettier',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react/jsx-runtime',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@tanstack/eslint-plugin-query/recommended',
    ],
    plugins: [
        'import',
        'react',
        'react-hooks',
        'jsx-a11y',
        '@typescript-eslint',
        'eslint-plugin-prettier',
        '@tanstack/query',
        'simple-import-sort',
    ],
    rules: {
        'import/no-unresolved': 'error',
        'no-console': 'off',
        '@typescript-eslint/no-unused-vars': ['off'],
        '@typescript-eslint/unbound-method': [
            'error',
            {
                ignoreStatic: true,
            },
        ],
        'prettier/prettier': ['error', {}, {usePrettierrc: true}],
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['*.config.ts'],
            },
        ],
        '@typescript-eslint/no-misused-promises': [
            2,
            {
                checksVoidReturn: {
                    attributes: false,
                },
            },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.eslint.json',
            },
        },
    },
}
