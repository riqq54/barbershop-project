import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!**/*.spec.ts', '!**/*.e2e-spec.ts'],
  outDir: 'build',
  dts: true,
  clean: true,
})
