import React, { useState, useEffect } from "react";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-banner">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>📲 Instalar Aplicativo de Estudos</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Instale o Dashboard no seu celular ou computador para acesso rápido e offline!
          </p>
        </div>
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => setShowBanner(false)}
          style={{ padding: "0.2rem 0.4rem" }}
        >
          ✖
        </button>
      </div>

      <button className="btn btn-primary" onClick={handleInstallClick} style={{ width: "100%", justifyContent: "center" }}>
        Instalar Agora
      </button>
    </div>
  );
}
