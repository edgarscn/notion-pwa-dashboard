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

    let databaseIdInput =
      body.databaseId ||
      event.headers["x-database-id"] ||
      process.env.NOTION_DATABASE_ID;

    if (!notionKey || !databaseIdInput) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Chave do Notion (NOTION_KEY) ou ID da Base de Dados (NOTION_DATABASE_ID) não configurados.",
          details: "Por favor, forneça as credenciais nas configurações do aplicativo."
        })
      };
    }

    // Split multiple database IDs if provided (comma or newline separated)
    const databaseIds = String(databaseIdInput)
      .split(/[\n,]+/)
      .map(id => id.trim().replace(/-/g, ""))
      .filter(Boolean);

    if (databaseIds.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nenhum ID de base de dados válido fornecido." })
      };
    }

    // Initialize Notion Client
    const notion = new Client({ auth: notionKey });

    let combinedResults = [];
    const MAX_PAGES_PER_DB = 30; // Up to 3,000 items per database

    // Query each database concurrently
    await Promise.all(
      databaseIds.map(async (dbId) => {
        let hasMore = true;
        let startCursor = undefined;
        let pageCount = 0;

        while (hasMore && pageCount < MAX_PAGES_PER_DB) {
          const response = await notion.databases.query({
            database_id: dbId,
            start_cursor: startCursor,
            page_size: 100
          });

          if (response && response.results) {
            combinedResults.push(...response.results);
          }

          hasMore = Boolean(response.has_more);
          startCursor = response.next_cursor;
          pageCount++;
        }
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: combinedResults.length,
        results: combinedResults
      })
    };
  } catch (error) {
    console.error("Erro na função Netlify Notion:", error);

    let userFriendlyMsg = error.message || "Erro desconhecido ao comunicar com a API do Notion.";
    if (error.code === "object_not_found") {
      userFriendlyMsg = "Uma ou mais bases de dados não foram encontradas. Verifique se adicionou a conexão 'Dashboard de Estudos' nas opções (...) de todas as suas tabelas no Notion.";
    } else if (error.code === "unauthorized") {
      userFriendlyMsg = "Token de acesso do Notion inválido ou sem permissão. Verifique a chave inserida.";
    }

    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: userFriendlyMsg,
        message: error.message,
        code: error.code
      })
    };
  }
};
