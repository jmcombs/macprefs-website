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
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/jmcombs/macprefs",
        },
      ],
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
            { label: "Fleet Management", slug: "guides/fleet-management" },
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
            href: "/favicon.ico",
            sizes: "32x32",
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
            content: "#0066FF",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://macprefs.app/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:width",
            content: "1200",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:height",
            content: "630",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:card",
            content: "summary_large_image",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: "https://macprefs.app/twitter-card.png",
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
