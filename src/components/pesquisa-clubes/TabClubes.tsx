import React from "react";
import "../tabs/tabs-bar-youtube.css"; // Certifique-se que o caminho está correto

interface Tab {
  key: string;
  label: string;
}

interface TabClubesProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabClubes({ tabs, activeTab, onTabChange }: TabClubesProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-full">
        <div className="tabs-bar-yt w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`tab-btn-yt${isActive ? " active" : ""}`}
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}