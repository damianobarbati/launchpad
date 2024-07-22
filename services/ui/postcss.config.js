import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import tailwindcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';

export default {
  plugins: [autoprefixer, postcssImport, tailwindcssNesting, tailwindcss, cssnano],
};
