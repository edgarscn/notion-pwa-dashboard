const { Client } = require("@notionhq/client");

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-notion-key, x-database-id",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
  }

  try {
    // Parse input credentials: body / headers / env variables
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = {};
      }
    }

    const notionKey =
      body.notionKey ||
      event.headers["x-notion-key"] ||
      process.env.NOTION_KEY;

    const databaseId =
      body.databaseId ||
      event.headers["x-database-id"] ||
      process.env.NOTION_DATABASE_ID;

    if (!notionKey || !databaseId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Chave do Notion (NOTION_KEY) ou ID da Base de Dados (NOTION_DATABASE_ID) não configurados.",
          details: "Por favor, forneça as credenciais nas configurações do aplicativo ou nas variáveis de ambiente do Netlify."
        })
      };
    }

    // Initialize Notion Client
    const notion = new Client({ auth: notionKey });

    let results = [];
    let hasMore = true;
    let startCursor = undefined;
    let pageCount = 0;
    const MAX_PAGES = 30; // Up to 3,000 database items

    // Fetch all pages from the database using full pagination
    while (hasMore && pageCount < MAX_PAGES) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
        page_size: 100
      });

      if (response && response.results) {
        results.push(...response.results);
      }

      hasMore = Boolean(response.has_more);
      startCursor = response.next_cursor;
      pageCount++;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: results.length,
        results
      })
    };
  } catch (error) {
    console.error("Erro na função Netlify Notion:", error);
    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({
        error: "Falha ao conectar com a API do Notion.",
        message: error.message,
        code: error.code
      })
    };
  }
};
