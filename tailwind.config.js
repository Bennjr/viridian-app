/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,svelte,vue}", // Correct: src folder, any subfolder, any extension
  ],
  theme: {
    extend: {
      colors: {
        c: {
          brand: "var(--c_brand)",
          light_brand: "var(--c-lighter-brand)",
          secondary_brand: "var(--c-secondary-brand)",
          primary: "var(--c_primary)",
          secondary: "var(--c_secondary_bg)",
          tertiery: "var(--c_tertiery)",
          opposite: "var(--c-opposite)",

          divider: "var(--c_dividers)",
          text: "var(--c_text)",
          text_opposite: "var(--c-text-opposite)",
          muted_text: "var(--c_text)",
          hover: "var(--c_hover)",

          btn: "var(--c_btn)",
          btn_hover: "var(--c_btn_hover)",
          icon: "var(--o_icon_bg)",
        },
        o: {
          bg: "var(--o_bg)",
          btn_bg: "var(--o_btn_bg)",
          icon: "var(--o_icon_bg)",
          icon_hover: "var(--o_icon_bg_hover)",
        }
      }
    },
  },
  plugins: [],
}