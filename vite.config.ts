/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      include: ['src/app.ts', 'src/card.ts', 'src/form.ts', 'src/table.ts']
    }
  },
})