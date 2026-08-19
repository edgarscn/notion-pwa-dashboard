const adapter = require("gatsby-adapter-netlify").default;

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  adapter: adapter(),
  siteMetadata: {
    title: `Dashboard de Estudos Concursos`,
    description: `Painel analítico PWA para monitorar horas líquidas de estudo, assertividade de questões e rendimento por matéria sincronizado com o Notion.`,
    author: `@edgar`,
    siteUrl: `https://notion-estudos-dashboard.netlify.app`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Dashboard de Estudos Concursos`,
        short_name: `Estudos Notion`,
        start_url: `/`,
        background_color: `#0f172a`,
        theme_color: `#3b82f6`,
        display: `standalone`,
        icon: `static/icon.svg`, // PWA icon
      },
    },
    `gatsby-plugin-offline`,
  ],
};
