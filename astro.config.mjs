// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://macprefs.app",
  integrations: [
    starlight({
      title: "macprefs",
      description: "Declarative macOS preferences manager",
      // Use catppuccin themes for code blocks - Latte for light, Frappé for dark
      expressiveCode: {
        themes: ["catppuccin-latte", "catppuccin-frappe"],
        styleOverrides: {
          borderRadius: "0.375rem",
        },
      },
      logo: {
        // White logo for both themes since header is always Path Blue
        src: "./src/assets/logo-wordmark-white.svg",
        replacesTitle: true,
        alt: "macprefs - Declare your Mac",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Installation",
              slug: "getting-started/installation",
            },
            { label: "Quick Start", slug: "getting-started/quick-start" },
            {
              label: "First Config",
              slug: "getting-started/first-config",
            },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Power Users", slug: "guides/power-users" },
            { label: "CI/CD", slug: "guides/ci-cd" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Examples",
          autogenerate: { directory: "examples" },
        },
      ],
      customCss: ["./src/styles/custom.css"],
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.svg",
            type: "image/svg+xml",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            href: "/apple-touch-icon.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "manifest",
            href: "/site.webmanifest",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            content: "#3465a4",
          },
        },
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
