import { defineConfig, transformWithOxc } from "vite"
import react from "@vitejs/plugin-react"

// Vite's default JSX handling skips plain `.js` files, but this project keeps
// its components in `.js` (Login.js, Dashboard.js, EmployeeFormModal.js), so we
// pre-transform them as JSX before the standard pipeline runs.
const jsxInJs = () => ({
  name: "jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    if (id.includes("node_modules") || !/\.js$/.test(id.split("?")[0])) return null
    return transformWithOxc(code, id, { lang: "jsx" })
  },
})

export default defineConfig({
  plugins: [jsxInJs(), react({ include: /\.(js|jsx)$/ })],
  server: {
    host: true,
    port: 3000,
  },
})
