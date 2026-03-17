/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,svelte,vue}",
  ],
  theme: {
    extend: {
      colors: {
        c: {
          brand: "var(--c_brand)",
          bg: "var(--c_bg)",
          secondary: "var(--c_secondary_bg)",
          text: "var(--c_text)",
          hover: "var(--c_hover)",
          btn: "var(--c_btn)",
          btn_hover: "var(--c_btn_hover)",
        },
        o: {
          bg: "var(--o_bg)",
          btn_bg: "var(--o_btn_bg)",
          icon_bg: "var(--o_icon_bg)",
          icon_bg_hover: "var(--o_icon_bg_hover)",
        }
      }
    },
  },
  plugins: [],
}