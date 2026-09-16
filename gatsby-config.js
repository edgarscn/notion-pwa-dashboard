const adapter = require("gatsby-adapter-netlify").default;

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  adapter: adapter(),
  siteMetadata: {
    title: `Notion PWA Workspace`,
    description: `Aplicação web modular inspirada no Notion, local-first com Dexie.js, PWA e visualizações em Tabela e Kanban.`,
    author: `@edgar`,
    siteUrl: `https://notion-pwa-workspace.netlify.app`,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Notion PWA Workspace`,
        short_name: `Notion PWA`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2563eb`,
        display: `standalone`,
        icon: `static/icon.svg`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
