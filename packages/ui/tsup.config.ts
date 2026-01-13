import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@chakra-ui/react',
    '@emotion/react',
    '@emotion/styled',
    'framer-motion',
  ],
  treeshake: true,
});
