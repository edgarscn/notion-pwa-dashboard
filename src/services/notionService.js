/**
 * Service for fetching, parsing, and calculating analytics from Notion Concurso Study Databases
 */

// Key for saving custom Notion config in LocalStorage
export const NOTION_CONFIG_KEY = "notion_study_config_v1";

/**
 * Neutral Demo Dataset (Used ONLY when user explicitly toggles Demo mode)
 */
export const DEMO_STUDY_DATASET = [
  {
    id: "demo-1",
    materia: "Direito Constitucional [Demo]",
    aula: "Aula 02",
    conteudo: "Direitos e Garantias Fundamentais",
    assunto: "Remédios Constitucionais (Habeas Corpus, Mandado de Segurança)",
    dataCriacao: "2026-08-17",
    tempoLiquidoMin: 120, // 2h
    totalQuestoes: 30,
    feitas: 30,
    acertos: 27,
    erros: 3,
    observacoes: "Ótimo aproveitamento na jurisprudência do STF sobre MS coletivo.",
    url: "#"
  },
  {
    id: "demo-2",
    materia: "Direito Administrativo [Demo]",
    aula: "Aula 04",
    conteudo: "Atos Administrativos",
    assunto: "Atributos e Anulabilidade dos Atos",
    dataCriacao: "2026-08-16",
    tempoLiquidoMin: 90, // 1.5h
    totalQuestoes: 25,
    feitas: 25,
    acertos: 18,
    erros: 7,
    observacoes: "Revisar revogação vs anulação e efeito ex tunc/ex nunc.",
    url: "#"
  },
  {
    id: "demo-3",
    materia: "Língua Portuguesa [Demo]",
    aula: "Aula 01",
    conteudo: "Sintaxe",
    assunto: "Crase e Regência Verbal",
    dataCriacao: "2026-08-16",
    tempoLiquidoMin: 75,
    totalQuestoes: 40,
    feitas: 40,
    acertos: 36,
    erros: 4,
    observacoes: "Crase facultativa dominada. Atenção a nomes de cidades.",
    url: "#"
  },
  {
    id: "demo-4",
    materia: "Raciocínio Lógico [Demo]",
    aula: "Aula 03",
    conteudo: "Lógica de Proposições",
    assunto: "Tabela Verdade e Equivalências Lógicas",
    dataCriacao: "2026-08-15",
    tempoLiquidoMin: 110,
    totalQuestoes: 35,
    feitas: 35,
    acertos: 24,
    erros: 11,
    observacoes: "Preciso memorizar a negação do 'Se... então' (Lei de Morgan).",
    url: "#"
  },
  {
    id: "demo-5",
    materia: "Direito Constitucional [Demo]",
    aula: "Aula 01",
    conteudo: "Princípios Fundamentais",
    assunto: "Fundamentos e Objetivos da República",
    dataCriacao: "2026-08-14",
    tempoLiquidoMin: 60,
    totalQuestoes: 20,
    feitas: 20,
    acertos: 19,
    erros: 1,
    observacoes: "Mnemônicos SO-CI-DI-VA-PO e CON-GA-ER-PRO.",
    url: "#"
  },
  {
    id: "demo-6",
    materia: "Informática [Demo]",
    aula: "Aula 02",
    conteudo: "Segurança da Informação",
    assunto: "Malwares, Phishing e Ransomware",
    dataCriacao: "2026-08-12",
    tempoLiquidoMin: 80,
    totalQuestoes: 25,
    feitas: 25,
    acertos: 23,
    erros: 2,
    observacoes: "Diferença entre Trojan e Worm bem assimilada.",
    url: "#"
  }
];

/**
 * Extract plain text / string / number value from any Notion property type
 */
function parseNotionProperty(prop) {
  if (!prop) return "";

  switch (prop.type) {
    case "title":
      return prop.title?.map(t => t.plain_text).join("") || "";
    case "rich_text":
      return prop.rich_text?.map(t => t.plain_text).join("") || "";
    case "select":
      return prop.select?.name || "";
    case "status":
      return prop.status?.name || "";
    case "multi_select":
      return prop.multi_select?.map(s => s.name).join(", ") || "";
    case "number":
      return prop.number !== null && prop.number !== undefined ? prop.number : 0;
    case "date":
      return prop.date?.start || "";
    case "created_time":
      return prop.created_time ? prop.created_time.split("T")[0] : "";
    case "last_edited_time":
      return prop.last_edited_time ? prop.last_edited_time.split("T")[0] : "";
    case "unique_id":
      return prop.unique_id?.number ? `${prop.unique_id.prefix || ''}${prop.unique_id.number}` : "";
    case "formula":
      if (prop.formula?.type === "string") return prop.formula.string || "";
      if (prop.formula?.type === "number") return prop.formula.number !== null ? prop.formula.number : 0;
      if (prop.formula?.type === "boolean") return prop.formula.boolean ? "Sim" : "Não";
      if (prop.formula?.type === "date") return prop.formula.date?.start || "";
      return "";
    case "rollup":
      if (prop.rollup?.type === "number") return prop.rollup.number !== null ? prop.rollup.number : 0;
      if (prop.rollup?.type === "date") return prop.rollup.date?.start || "";
      if (prop.rollup?.type === "array") {
        return prop.rollup.array?.map(parseNotionProperty).filter(Boolean).join(", ") || "";
      }
      return "";
    case "relation":
      return prop.relation?.map(r => r.id).join(", ") || "";
    default:
      return "";
  }
}

/**
 * Normalize Notion API response pages into standardized Study Records
 */
export function normalizeNotionPages(results) {
  if (!Array.isArray(results)) return [];

  return results.map(page => {
    const props = page.properties || {};

    // Helper to find property by name aliases or case-insensitive search
    const findProp = (possibleNames) => {
      for (const name of possibleNames) {
        const exactKey = Object.keys(props).find(k => k.trim().toLowerCase() === name.trim().toLowerCase());
        if (exactKey) return props[exactKey];
      }
      return null;
    };

    // Find page Title property dynamically if specified alias not found
    let titleProp = findProp(["Conteúdo", "Conteudo", "Content", "Nome", "Title", "Tópico", "Topico", "Descrição", "Descricao", "Task", "Item"]);
    if (!titleProp) {
      const titleKey = Object.keys(props).find(k => props[k]?.type === "title");
      if (titleKey) titleProp = props[titleKey];
    }

    const materia = parseNotionProperty(findProp(["Matéria", "Materia", "Disciplina", "Subject", "Curso", "Área", "Area", "Modulo", "Módulo"])) || "Geral";
    const aula = parseNotionProperty(findProp(["Aula", "Unidade", "Lesson", "Capítulo", "Capitulo", "Bloco"])) || "-";
    const conteudo = parseNotionProperty(titleProp) || "Estudo sem título";
    const assunto = parseNotionProperty(findProp(["Assunto", "Subtópico", "Subtopico", "Topic", "Detalhes", "Tema"])) || "-";
    
    let dataCriacao = parseNotionProperty(findProp(["Data de Criação", "Data de criação", "Data de Criacao", "Data", "Date", "Dia", "Data do Estudo"]));
    if (!dataCriacao && page.created_time) {
      dataCriacao = page.created_time.split("T")[0];
    }

    const tempoLiquido = Number(parseNotionProperty(findProp(["Tempo de estudo líquido", "Tempo de Estudo Líquido", "Tempo de Estudo Liquido", "Tempo Líquido", "Tempo Liquido", "Tempo (min)", "Tempo", "Minutos", "Duração", "Duracao", "Horas", "Estudo (min)"]))) || 0;
    const totalQuestoes = Number(parseNotionProperty(findProp(["Total de questões", "Total de Questões", "Total de questoes", "Total Questoes", "Total de Questões Resolvidas", "Qtd Questões", "Questoes Total"]))) || 0;
    const feitas = Number(parseNotionProperty(findProp(["Feitas", "Questões Feitas", "Questoes Feitas", "Resolvidas", "Qtd Feitas", "Questões"]))) || 0;
    const acertos = Number(parseNotionProperty(findProp(["Acertos", "Questões Certas", "Questoes Certas", "Certas", "Corretas", "Qtd Acertos", "Qtd Certas"]))) || 0;
    const erros = Number(parseNotionProperty(findProp(["Erros", "Questões Erradas", "Questoes Erradas", "Erradas", "Incorretas", "Qtd Erros", "Qtd Erradas"]))) || 0;
    const observacoes = parseNotionProperty(findProp(["Observações", "Observacoes", "Notas", "Comentários", "Comentarios", "Anotações", "Anotacoes", "Obs"])) || "";

    return {
      id: page.id,
      materia,
      aula,
      conteudo,
      assunto,
      dataCriacao: dataCriacao || new Date().toISOString().split("T")[0],
      tempoLiquidoMin: tempoLiquido,
      totalQuestoes: totalQuestoes || feitas,
      feitas: feitas || (acertos + erros),
      acertos,
      erros,
      observacoes,
      url: page.url || "#"
    };
  });
}

/**
 * Calculate comprehensive analytics and KPIs for Concurso studies
 */
export function calculateStudyAnalytics(records = []) {
  if (!records.length) {
    return {
      totalSessoes: 0,
      tempoTotalMin: 0,
      tempoTotalFormatado: "0h 0m",
      totalFeitas: 0,
      totalAcertos: 0,
      totalErros: 0,
      taxaAssertividade: 0,
      materiasBreakdown: [],
      materiasCriticas: [],
      evolucaoDiaria: []
    };
  }

  let tempoTotalMin = 0;
  let totalFeitas = 0;
  let totalAcertos = 0;
  let totalErros = 0;

  const materiasMap = {};
  const datasMap = {};

  records.forEach(r => {
    tempoTotalMin += r.tempoLiquidoMin || 0;
    totalFeitas += r.feitas || 0;
    totalAcertos += r.acertos || 0;
    totalErros += r.erros || 0;

    // Grouping by Matéria
    const mat = r.materia || "Outros";
    if (!materiasMap[mat]) {
      materiasMap[mat] = {
        materia: mat,
        tempoMin: 0,
        feitas: 0,
        acertos: 0,
        erros: 0,
        sessoes: 0
      };
    }
    materiasMap[mat].tempoMin += r.tempoLiquidoMin || 0;
    materiasMap[mat].feitas += r.feitas || 0;
    materiasMap[mat].acertos += r.acertos || 0;
    materiasMap[mat].erros += r.erros || 0;
    materiasMap[mat].sessoes += 1;

    // Grouping by Date for Evolution Timeline
    const dateKey = r.dataCriacao || "Outras";
    if (!datasMap[dateKey]) {
      datasMap[dateKey] = { date: dateKey, tempoMin: 0, questoes: 0 };
    }
    datasMap[dateKey].tempoMin += r.tempoLiquidoMin || 0;
    datasMap[dateKey].questoes += r.feitas || 0;
  });

  // Calculate formatted time
  const horas = Math.floor(tempoTotalMin / 60);
  const mins = tempoTotalMin % 60;
  const tempoTotalFormatado = `${horas}h ${mins}m`;

  // Calculate global accuracy %
  const taxaAssertividade = totalFeitas > 0 ? ((totalAcertos / totalFeitas) * 100).toFixed(1) : 0;

  // Format Matérias breakdown array with accuracy rates
  const materiasBreakdown = Object.values(materiasMap).map(m => {
    const acc = m.feitas > 0 ? ((m.acertos / m.feitas) * 100).toFixed(1) : 0;
    const h = Math.floor(m.tempoMin / 60);
    const mRemaining = m.tempoMin % 60;
    return {
      ...m,
      taxaAcerto: parseFloat(acc),
      tempoFormatado: `${h}h ${mRemaining}m`
    };
  }).sort((a, b) => b.tempoMin - a.tempoMin);

  // Identify Critical Subjects (< 75% accuracy or highest error count)
  const materiasCriticas = materiasBreakdown
    .filter(m => m.feitas > 0 && m.taxaAcerto < 75)
    .sort((a, b) => a.taxaAcerto - b.taxaAcerto);

  // Format Evolution timeline array (sorted chronologically)
  const evolucaoDiaria = Object.values(datasMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      ...d,
      tempoHoras: (d.tempoMin / 60).toFixed(1)
    }));

  return {
    totalSessoes: records.length,
    tempoTotalMin,
    tempoTotalFormatado,
    totalFeitas,
    totalAcertos,
    totalErros,
    taxaAssertividade: parseFloat(taxaAssertividade),
    materiasBreakdown,
    materiasCriticas,
    evolucaoDiaria
  };
}

/**
 * Fetch records from Netlify serverless proxy
 */
export async function fetchNotionStudyRecords(config) {
  const proxyUrl = "/api/notion";

  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        notionKey: config?.notionKey,
        databaseId: config?.databaseId
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || "Erro de resposta da API Netlify Notion");
    }

    return normalizeNotionPages(data.results);
  } catch (err) {
    console.warn("Erro ao buscar via Netlify Proxy:", err);
    throw err;
  }
}
