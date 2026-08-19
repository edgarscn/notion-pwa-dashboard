import React from "react";

export default function MetricCard({ title, value, subtext, icon, trendClass }) {
  return (
    <div className="glass-card metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className="metric-icon-box">{icon}</div>
      </div>
      <div className="metric-value">{value}</div>
      {subtext && (
        <div className={`metric-subtext ${trendClass || ""}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}
