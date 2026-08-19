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

const LIVE_CACHE_KEY = "notion_study_user_live_cache_v2";

export default function IndexPage() {
  const [theme, setTheme] = useState("dark");
  const [isOffline, setIsOffline] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Notion API config stored in local storage
  const [notionConfig, setNotionConfig] = useState(null);
  const [records, setRecords] = useState([]);

  // Load saved configuration and cached user live records on mount
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

          // Load user's cached live records
          const cachedLive = localStorage.getItem(LIVE_CACHE_KEY);
          if (cachedLive) {
            try {
              const parsedCache = JSON.parse(cachedLive);
              if (Array.isArray(parsedCache)) {
                setRecords(parsedCache);
                setIsLive(true);
              }
            } catch (e) {}
          }
        }
      } catch (e) {
        console.error("Erro ao carregar configurações salvas:", e);
      }
    } else {
      // Default to demo mode if no Notion credentials configured yet
      setIsDemo(true);
      setRecords(DEMO_STUDY_DATASET);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch live records from Notion API
  const loadLiveData = useCallback(async (configToUse, silent = false) => {
    const cfg = configToUse || notionConfig;
    if (!cfg || !cfg.notionKey || !cfg.databaseId) {
      setIsDemo(true);
      setRecords(DEMO_STUDY_DATASET);
      return;
    }

    if (!silent) setLoading(true);
    setErrorMessage("");

    try {
      const fetchedRecords = await fetchNotionStudyRecords(cfg);
      const nowTime = new Date().toLocaleTimeString();

      if (fetchedRecords) {
        setRecords(fetchedRecords);
        setIsLive(true);
        setIsDemo(false);
        setLastSyncTime(nowTime);
        localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify(fetchedRecords));
      }
    } catch (err) {
      console.error("Falha ao carregar dados do Notion:", err);
      // NEVER bleed demo data into live mode! Show explicit error instead.
      setErrorMessage("Erro ao sincronizar com a API do Notion: " + (err.message || "Verifique suas credenciais."));
      setIsLive(false);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [notionConfig]);

  // Initial load when notionConfig is set
  useEffect(() => {
    if (!isDemo && notionConfig?.notionKey && notionConfig?.databaseId) {
      loadLiveData(notionConfig);
    }
  }, [isDemo, notionConfig, loadLiveData]);

  // Real-Time Polling Auto-Sync (Every 30 seconds when Live Mode is active)
  useEffect(() => {
    if (isDemo || !autoSyncEnabled || !notionConfig?.notionKey || !notionConfig?.databaseId) {
      return;
    }

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && navigator.onLine) {
        loadLiveData(notionConfig, true);
      }
    }, 30000); // 30 seconds real-time polling

    return () => clearInterval(interval);
  }, [isDemo, autoSyncEnabled, notionConfig, loadLiveData]);

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
    setRecords([]); // Clear demo data before live fetch
    loadLiveData(newConfig);
  };

  // Toggle Demo vs Notion mode
  const handleToggleDemo = () => {
    if (isDemo) {
      if (notionConfig?.notionKey && notionConfig?.databaseId) {
        setIsDemo(false);
        setRecords([]);
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
        lastSyncTime={lastSyncTime}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={() => setAutoSyncEnabled(!autoSyncEnabled)}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={() => isDemo ? setRecords([...DEMO_STUDY_DATASET]) : loadLiveData(notionConfig)}
      />

      {/* Warning/Error Banner */}
      {errorMessage && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>⚠️ {errorMessage}</span>
          <button className="btn btn-secondary" onClick={() => setIsSettingsOpen(true)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
            Revisar Credenciais
          </button>
        </div>
      )}

      {/* Loading Bar */}
      {loading && (
        <div style={{ padding: "1rem", textAlign: "center", background: "var(--bg-card)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
          🔄 Sincronizando dados com o seu Notion em tempo real...
        </div>
      )}

      {/* Empty State Warning if live database has no records yet */}
      {!isDemo && !loading && records.length === 0 && !errorMessage && (
        <div className="glass-card" style={{ textAlign: "center", padding: "2rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📖</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Sua base de dados no Notion está conectada!</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Preencha suas sessões de estudo na tabela do Notion. Assim que adicionar registros, seus gráficos e métricas serão exibidos aqui em tempo real.
          </p>
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
