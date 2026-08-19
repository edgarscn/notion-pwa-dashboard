import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import { SubjectPerformanceChart, SubjectTimeChart, DailyEvolutionChart } from "../components/Charts";
import CriticalTopics from "../components/CriticalTopics";
import DataTable from "../components/DataTable";
import SettingsModal from "../components/SettingsModal";
import PWAInstallBanner from "../components/PWAInstallBanner";
import {
  NOTION_CONFIG_KEY,
  DEMO_STUDY_DATASET,
  calculateStudyAnalytics,
  fetchNotionStudyRecords
} from "../services/notionService";
import "../styles/global.css";

const CACHED_RECORDS_KEY = "notion_study_cached_records_v1";

export default function IndexPage() {
  const [theme, setTheme] = useState("dark");
  const [isOffline, setIsOffline] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Notion API config stored in local storage
  const [notionConfig, setNotionConfig] = useState(null);
  const [records, setRecords] = useState(DEMO_STUDY_DATASET);

  // Load theme & settings on mount
  useEffect(() => {
    // Theme preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Online/Offline status listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // Load saved Notion config
    const savedConfig = localStorage.getItem(NOTION_CONFIG_KEY);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.notionKey && parsed.databaseId) {
          setNotionConfig(parsed);
          setIsDemo(false);
        }
      } catch (e) {
        console.error("Erro ao carregar configurações salvas:", e);
      }
    }

    // Load cached records if available
    const cached = localStorage.getItem(CACHED_RECORDS_KEY);
    if (cached) {
      try {
        setRecords(JSON.parse(cached));
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch live records from Notion API
  const loadLiveData = useCallback(async (configToUse) => {
    const cfg = configToUse || notionConfig;
    if (!cfg || !cfg.notionKey || !cfg.databaseId) {
      setIsDemo(true);
      setRecords(DEMO_STUDY_DATASET);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const fetchedRecords = await fetchNotionStudyRecords(cfg);
      if (fetchedRecords && fetchedRecords.length > 0) {
        setRecords(fetchedRecords);
        setIsLive(true);
        setIsDemo(false);
        localStorage.setItem(CACHED_RECORDS_KEY, JSON.stringify(fetchedRecords));
      } else {
        setErrorMessage("Nenhum registro encontrado na base de dados do Notion fornecida.");
      }
    } catch (err) {
      console.error("Falha ao carregar dados do Notion:", err);
      setErrorMessage("Erro ao conectar com a API do Notion. Exibindo dados simulados (Demo).");
      setIsDemo(true);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [notionConfig]);

  // Load live data if config changes and demo is false
  useEffect(() => {
    if (!isDemo && notionConfig?.notionKey && notionConfig?.databaseId) {
      loadLiveData(notionConfig);
    }
  }, [isDemo, notionConfig, loadLiveData]);

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Save Notion Config
  const handleSaveConfig = (newConfig) => {
    setNotionConfig(newConfig);
    localStorage.setItem(NOTION_CONFIG_KEY, JSON.stringify(newConfig));
    setIsDemo(false);
    loadLiveData(newConfig);
  };

  // Toggle Demo vs Notion mode
  const handleToggleDemo = () => {
    if (isDemo) {
      if (notionConfig?.notionKey && notionConfig?.databaseId) {
        setIsDemo(false);
        loadLiveData(notionConfig);
      } else {
        setIsSettingsOpen(true);
      }
    } else {
      setIsDemo(true);
      setIsLive(false);
      setRecords(DEMO_STUDY_DATASET);
    }
  };

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    return calculateStudyAnalytics(records);
  }, [records]);

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header
        isLive={isLive}
        isOffline={isOffline}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={() => isDemo ? setRecords([...DEMO_STUDY_DATASET]) : loadLiveData()}
      />

      {/* Warning/Error Banner */}
      {errorMessage && (
        <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>⚠️ {errorMessage}</span>
          <button className="btn btn-secondary" onClick={() => setIsSettingsOpen(true)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
            Revisar Credenciais
          </button>
        </div>
      )}

      {/* Loading Bar */}
      {loading && (
        <div style={{ padding: "1rem", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
          🔄 Sincronizando dados com a API do Notion...
        </div>
      )}

      {/* Key Metric KPI Cards */}
      <section className="metrics-grid">
        <MetricCard
          title="Tempo Total Líquido"
          value={analytics.tempoTotalFormatado}
          subtext={`${analytics.totalSessoes} sessões de estudo registradas`}
          icon="⏱️"
          trendClass="metric-trend-high"
        />
        <MetricCard
          title="Taxa de Assertividade"
          value={`${analytics.taxaAssertividade}%`}
          subtext={`${analytics.totalAcertos} acertos de ${analytics.totalFeitas} questões`}
          icon="🎯"
          trendClass={analytics.taxaAssertividade >= 80 ? "metric-trend-high" : analytics.taxaAssertividade >= 70 ? "metric-trend-mid" : "metric-trend-low"}
        />
        <MetricCard
          title="Questões Resolvidas"
          value={analytics.totalFeitas}
          subtext={`${analytics.totalAcertos} certas, ${analytics.totalErros} erradas`}
          icon="📝"
          trendClass="metric-trend-high"
        />
        <MetricCard
          title="Matérias Cobertas"
          value={analytics.materiasBreakdown.length}
          subtext="Disciplinas ativas no seu ciclo"
          icon="📚"
          trendClass="metric-trend-high"
        />
      </section>

      {/* Main Analytics Dashboard Grid */}
      <section className="dashboard-grid">
        {/* Left Column: Visual Charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Chart 1: Performance by Subject */}
          <div className="glass-card">
            <h3 className="section-title">
              <span>📊 Rendimento de Questões por Matéria (% Acertos)</span>
            </h3>
            <SubjectPerformanceChart materias={analytics.materiasBreakdown} />
          </div>

          {/* Chart 2: Daily Study Evolution */}
          <div className="glass-card">
            <h3 className="section-title">
              <span>📈 Evolução Diária de Horas Líquidas</span>
            </h3>
            <DailyEvolutionChart evolucao={analytics.evolucaoDiaria} />
          </div>
        </div>

        {/* Right Column: Time Allocation & Critical Revision Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Time per Subject */}
          <div className="glass-card">
            <h3 className="section-title">
              <span>⏳ Horas Estudadas por Matéria</span>
            </h3>
            <SubjectTimeChart materias={analytics.materiasBreakdown} />
          </div>

          {/* Critical Topics Warning Widget */}
          <CriticalTopics materiasCriticas={analytics.materiasCriticas} />
        </div>
      </section>

      {/* Detailed Searchable Data Table */}
      <section style={{ marginBottom: "2rem" }}>
        <DataTable records={records} />
      </section>

      {/* Notion Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={notionConfig}
        onSaveConfig={handleSaveConfig}
        isDemo={isDemo}
        onToggleDemo={handleToggleDemo}
      />

      {/* Native Browser PWA Install Prompt Banner */}
      <PWAInstallBanner />
    </div>
  );
}
