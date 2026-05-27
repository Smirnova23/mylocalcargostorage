import React, { useState, useEffect } from 'react';

const ZoneStatusDashboard = () => {
    const [zones, setZones] = useState({});
    const [currentModal, setCurrentModal] = useState(null);
    const [dismissedZones, setDismissedZones] = useState(new Set()); // зоны, по которым пользователь уже нажал кнопку

    const fetchZoneStatus = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/bin/zones/status');
            const data = await res.json();
            console.log('📥 [ZONES] Данные от сервера:', data);
            setZones(data || {});
        } catch (e) {
            console.error('❌ [ZONES] Ошибка:', e);
        }
    };

    useEffect(() => {
        console.log('🔄 ZoneStatusDashboard mounted');
        fetchZoneStatus();
        const interval = setInterval(fetchZoneStatus, 4000);
        return () => clearInterval(interval);
    }, []);

    // Логика показа алерта
    useEffect(() => {
        Object.entries(zones).forEach(([zoneId, zone]) => {
            if (zone.status === 'critical') {
                // Показываем алерт только если пользователь ещё не подтвердил проблему в этой зоне
                if (!currentModal && !dismissedZones.has(zoneId)) {
                    console.log(`🚨 ПОКАЗЫВАЕМ АЛЕРТ для зоны: ${zone.name}`);
                    setCurrentModal({
                        zoneId,
                        zoneName: zone.name,
                        param: zone.problemParam,
                        value: zone.problemParam === 'temperature'
                            ? `${Number(zone.currentTemp).toFixed(1)}°C`
                            : `${Number(zone.currentHum).toFixed(1)}%`,
                        norm: zone.problemParam === 'temperature'
                            ? `${zone.default_temp_min}–${zone.default_temp_max}°C`
                            : `${zone.default_humidity_min}–${zone.default_humidity_max}%`,
                        affectedCargos: zone.affectedCargos || []
                    });
                }
            }
            else if (zone.status === 'norm' && dismissedZones.has(zoneId)) {
                // Когда зона вернулась в норму — снимаем флаг "подтверждено"
                console.log(`✅ Зона ${zone.name} вернулась в норму — снимаем dismissed`);
                setDismissedZones(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(zoneId);
                    return newSet;
                });
            }
        });
    }, [zones, currentModal, dismissedZones]);

    const handleTakeAction = () => {
        if (currentModal) {
            console.log(`✅ Пользователь принял меры по зоне: ${currentModal.zoneName}`);
            setDismissedZones(prev => new Set([...prev, currentModal.zoneId]));
            setCurrentModal(null);
        }
    };

    return (
        <>
            {currentModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        width: '520px',
                        maxWidth: '92%',
                        borderRadius: '16px',
                        padding: '30px',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: '#c00' }}>🚨 КРИТИЧЕСКОЕ НАРУШЕНИЕ!</h2>
                        <p>Зона: <strong>{currentModal.zoneName}</strong></p>
                        <p style={{ fontSize: '1.5em', color: '#c00' }}>
                            {currentModal.param === 'temperature' ? '🌡️' : '💧'} {currentModal.value}
                        </p>
                        <p>Норма: {currentModal.norm}</p>

                        {currentModal.affectedCargos.length > 0 && (
                            <div style={{ textAlign: 'left', margin: '20px 0' }}>
                                <strong>Затронутые товары:</strong>
                                <ul style={{ paddingLeft: '22px' }}>
                                    {currentModal.affectedCargos.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleTakeAction}
                            style={{
                                marginTop: '20px',
                                padding: '14px 36px',
                                background: '#c00',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1em',
                                cursor: 'pointer'
                            }}
                        >
                            Я приму меры
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ZoneStatusDashboard;