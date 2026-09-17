import { useState } from 'react';
import './Tabs.css';

export default function Tabs({ tabs, activeTab, onChange, children }) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalActive;

  const handleSelect = (id) => {
    if (onChange) onChange(id);
    else setInternalActive(id);
  };

  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-trigger ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => handleSelect(tab.id)}
            type="button"
          >
            {tab.icon && <tab.icon size={16} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {children ? (
          typeof children === 'function' ? children(currentTab) : children
        ) : (
          tabs.find(t => t.id === currentTab)?.content
        )}
      </div>
    </div>
  );
}
