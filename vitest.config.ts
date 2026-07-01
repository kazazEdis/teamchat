import { defineConfig } from "vitest/config";

// jsdom for the DOM-construction tests in mentionText.test.ts (serializeRoot walks real nodes).
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
