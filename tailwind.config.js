/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,svelte,vue}",
    "./src-tauri/src/**/*.html"  
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

