import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigGoogle from 'eslint-config-google';


export default [
  {
    files: ['**/*.js'],
    languageOptions: {sourceType: 'commonjs'},
  },
  {
    languageOptions: {globals: globals.node},
  },
  // pluginJs.configs.recommended,
  eslintConfigGoogle,
];
