/**
 * Service for fetching, parsing, and calculating analytics from Notion Concurso Study Databases
 */

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
 * Clean string property key (strips emojis, accents, symbols for matching)
 */
function cleanKey(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/gi, "") // remove emojis & symbols
    .trim();
}

/**
 * Robustly extract plain text / string / number value from any Notion property type
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
        const parsedArray = prop.rollup.array?.map(parseNotionProperty).filter(v => v !== "" && v !== null && v !== undefined);
        if (!parsedArray || parsedArray.length === 0) return "";
        // If all items in array are numbers, sum them!
        const allNumbers = parsedArray.every(v => typeof v === "number" || (!isNaN(v) && v !== ""));
        if (allNumbers) {
          return parsedArray.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        }
        return parsedArray.join(", ");
      }
      return "";
    case "relation":
      return prop.relation?.map(r => r.id).join(", ") || "";
    default:
      return "";
  }
}

/**
 * Parse time values (handles minutes, hours, "1h30m", "01:30", "90 min")
 */
function parseTimeValue(val) {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") {
    // If number is small decimal (e.g. 1.5 hours), convert to 90 minutes. If > 12, assume minutes.
    if (val > 0 && val <= 15) return Math.round(val * 60);
    return Math.round(val);
  }

  const str = String(val).trim().toLowerCase();
  if (!str) return 0;

  // Handles "1h30m", "1h 30min", "2h"
  if (str.includes("h")) {
    const hMatch = str.match(/(\d+)\s*h/);
    const mMatch = str.match(/(\d+)\s*m/);
    const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
    const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
    return hours * 60 + mins;
  }

  // Handles "01:30" (hh:mm)
  if (str.includes(":")) {
    const parts = str.split(":");
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    return hours * 60 + mins;
  }

  // Pure numeric string
  const num = parseFloat(str.replace(",", "."));
  if (!isNaN(num)) {
    if (num > 0 && num <= 15) return Math.round(num * 60);
    return Math.round(num);
  }

  return 0;
}

/**
 * Extract numerical integer value safely
 */
function parseNumberValue(val) {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") return Math.round(val);
  const str = String(val).replace(",", ".").replace(/[^\d.-]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num);
}

/**
 * Normalize Notion API response pages into standardized Study Records
 */
export function normalizeNotionPages(results) {
  if (!Array.isArray(results)) return [];

  return results.map(page => {
    const props = page.properties || {};
    const propKeys = Object.keys(props);

    // Helper to search property by standard Portuguese names or clean aliases
    const findPropByAliases = (possibleAliases) => {
      const cleanAliases = possibleAliases.map(cleanKey);
      for (const key of propKeys) {
        const ck = cleanKey(key);
        if (cleanAliases.includes(ck)) {
          return props[key];
        }
      }
      // Partial matching fallback
      for (const key of propKeys) {
        const ck = cleanKey(key);
        for (const alias of cleanAliases) {
          if (ck.includes(alias) || alias.includes(ck)) {
            return props[key];
          }
        }
      }
      return null;
    };

    // Find page Title property dynamically
    let titleProp = findPropByAliases(["conteudo", "nome", "title", "content", "topico", "descricao", "task", "item", "estudo"]);
    if (!titleProp) {
      const titleKey = propKeys.find(k => props[k]?.type === "title");
      if (titleKey) titleProp = props[titleKey];
    }

    const materiaRaw = parseNotionProperty(findPropByAliases(["materia", "disciplina", "subject", "curso", "area", "modulo"]));
    const materia = materiaRaw ? String(materiaRaw) : "Geral";

    const aulaRaw = parseNotionProperty(findPropByAliases(["aula", "unidade", "lesson", "capitulo", "bloco"]));
    const aula = aulaRaw ? String(aulaRaw) : "-";

    const conteudoRaw = parseNotionProperty(titleProp);
    const conteudo = conteudoRaw ? String(conteudoRaw) : "Estudo sem título";

    const assuntoRaw = parseNotionProperty(findPropByAliases(["assunto", "subtopico", "topic", "detalhes", "tema"]));
    const assunto = assuntoRaw ? String(assuntoRaw) : "-";
    
    let dataCriacaoRaw = parseNotionProperty(findPropByAliases(["data de criacao", "data", "date", "dia", "data do estudo"]));
    if (!dataCriacaoRaw && page.created_time) {
      dataCriacaoRaw = page.created_time.split("T")[0];
    }

    const tempoLiquidoVal = parseNotionProperty(findPropByAliases(["tempo de estudo liquido", "tempo liquido", "tempo min", "tempo", "minutos", "duracao", "horas", "estudo min"]));
    const tempoLiquidoMin = parseTimeValue(tempoLiquidoVal);

    const totalQuestoesVal = parseNotionProperty(findPropByAliases(["total de questoes", "total questoes", "total de questoes resolvidas", "qtd questoes", "questoes total"]));
    const totalQuestoes = parseNumberValue(totalQuestoesVal);

    const feitasVal = parseNotionProperty(findPropByAliases(["feitas", "questoes feitas", "resolvidas", "qtd feitas", "questoes"]));
    let feitas = parseNumberValue(feitasVal);

    const acertosVal = parseNotionProperty(findPropByAliases(["acertos", "questoes certas", "certas", "corretas", "qtd acertos", "qtd certas"]));
    const acertos = parseNumberValue(acertosVal);

    const errosVal = parseNotionProperty(findPropByAliases(["erros", "questoes erradas", "erradas", "incorretas", "qtd erros", "qtd erradas"]));
    const erros = parseNumberValue(errosVal);

    const observacoesRaw = parseNotionProperty(findPropByAliases(["observacoes", "notas", "comentarios", "anotacoes", "obs"]));
    const observacoes = observacoesRaw ? String(observacoesRaw) : "";

    // Auto-calculate feitas if 0 but acertos + erros exist
    if (!feitas && (acertos > 0 || erros > 0)) {
      feitas = acertos + erros;
    }
    if (!feitas && totalQuestoes > 0) {
      feitas = totalQuestoes;
    }

    return {
      id: page.id,
      materia,
      aula,
      conteudo,
      assunto,
      dataCriacao: String(dataCriacaoRaw || new Date().toISOString().split("T")[0]),
      tempoLiquidoMin,
      totalQuestoes: totalQuestoes || feitas,
      feitas,
      acertos,
      erros,
      observacoes,
      url: page.url || "#"
    };
  });
}

/**
 * Inspect detected Notion database columns for transparency/debugging
 */
export function inspectNotionColumns(results) {
  if (!Array.isArray(results) || results.length === 0) return [];
  const firstPage = results[0];
  const props = firstPage.properties || {};

  return Object.keys(props).map(key => ({
    name: key,
    type: props[key]?.type || "unknown",
    sampleValue: String(parseNotionProperty(props[key]))
  }));
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

    return {
      records: normalizeNotionPages(data.results),
      columns: inspectNotionColumns(data.results)
    };
  } catch (err) {
    console.warn("Erro ao buscar via Netlify Proxy:", err);
    throw err;
  }
}
