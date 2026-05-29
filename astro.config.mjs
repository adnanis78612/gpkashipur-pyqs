import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://gpkashipur-pyqs.vercel.app",

  output: "server",

  adapter: vercel(),

  integrations: [
    sitemap(),
    icon(),
    mdx(),
  ],
});