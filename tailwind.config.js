/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,svelte,vue}",
    "./src-tauri/src/**/*.html"  
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: "var(--primary-bg)",
          text: "var(--primary-text)",
          btn: {
            bg: "var(--primary-btn-bg)",
            text: "var(--primary-btn-text)",
            hover: {
              bg: "var(--primary-btn-hover-bg)",
              text: "var(--primary-btn-hover-text)",
            },
          },
        },
        secondary: {
          bg: "var(--secondary-bg)",
        }
      },
    },
  },
  plugins: [],
}

