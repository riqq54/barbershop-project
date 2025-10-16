import { loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    dir: 'src',
    globals: true,
    root: './',
    coverage: {
      include: ['src/app/use-cases/*.ts'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: './src/app/use-cases',
          include: ['**/*.spec.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: './src/infra/http/controllers',
          include: ['**/*.e2e-spec.ts'],
          environment: './src/test/setup-e2e.ts',
        },
      },
    ],
    env: loadEnv(mode, process.cwd(), ''),
  },
  plugins: [tsConfigPaths()],
}))
