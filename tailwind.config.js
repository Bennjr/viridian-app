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
        c: {
          brand: "var(--c_brand)",

          bg: "var(--c_bg)",
          text: "var(--c_text)",

          light_btn: "var(--c_light_btn)",
          light_btn_hover: "var(--c_light_btn_hover)",

          dark_btn: "var(--c_dark_btn)",
          dark_btn_hover: "var(--c_dark_btn_hover)",

          nav: {
            bg: "var(--c-nav-bg)",
            btn_bg: "var(--c-nav-btn-bg)",
            btn_hover: "var(--c-nav-btn-hover)",
          }
        },
        o: {
          brand: "var(--c_brand)",
          bg: "var(--o_bg)",
          btn_bg: "var(--o_btn_bg)",
          icon_bg: "var(--o_icon_bg)"
        }
      }
    },
  },
  plugins: [],
}

