import React, { useState } from 'react';

const MainTabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: '📦 Структура склада', component: children[0] },
        { id: 1, label: '➕ Размещение', component: children[1] },
        { id: 2, label: '🚨 Зоны хранения', component: children[2] },
        { id: 3, label: '📊 Прогнозы', component: children[3] },
        { id: 4, label: '🔍 Поиск грузов', component: children[4] },
    ];

    return (
        <div>
            {/* Табы */}
            <div style={{
                display: 'flex',
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #006400',
                marginBottom: '20px',
                borderRadius: '8px 8px 0 0',
                overflow: 'hidden'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '14px 24px',
                            fontSize: '1.05em',
                            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                            backgroundColor: activeTab === tab.id ? '#006400' : '#f8f9fa',
                            color: activeTab === tab.id ? 'white' : '#333',
                            border: 'none',
                            cursor: 'pointer',
                            flex: 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Контент активной вкладки */}
            <div>
                {tabs.map(tab => (
                    <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                        {tab.component}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainTabs;