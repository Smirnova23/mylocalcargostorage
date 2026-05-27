import React, { useState, useEffect } from 'react';

const ZoneStatusDashboard = () => {
    const [zones, setZones] = useState({});
    const [currentModal, setCurrentModal] = useState(null);        // текущий активный модальный алерт
    const [dismissedZones, setDismissedZones] = useState(new Set()); // зоны, по которым пользователь уже нажал "Я приму меры"

    const fetchZoneStatus = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/bin/zones/status');
            const data = await res.json();
            setZones(data);
        } catch (e) {
            console.error('Ошибка загрузки состояния зон:', e);
        }
    };

    useEffect(() => {
        fetchZoneStatus();
        const interval = setInterval(fetchZoneStatus, 6000);
        return () => clearInterval(interval);
    }, []);

    // Показываем модальное окно только при новом критическом состоянии
    useEffect(() => {
        Object.entries(zones).forEach(([zoneId, zone]) => {
            if (zone.status === 'critical' && !currentModal && !dismissedZones.has(zoneId)) {
                setCurrentModal({
                    zoneId: zoneId,
                    zoneName: zone.name,
                    param: zone.problemParam,
                    value: zone.problemParam === 'temperature'
                        ? `${zone.currentTemp.toFixed(1)}°C`
                        : `${zone.currentHum.toFixed(1)}%`,
                    norm: zone.problemParam === 'temperature'
                        ? `${zone.default_temp_min}–${zone.default_temp_max}°C`
                        : `${zone.default_humidity_min}–${zone.default_humidity_max}%`,
                    affectedCargos: zone.affectedCargos || []
                });
            }
        });
    }, [zones, currentModal, dismissedZones]);

    const handleTakeAction = () => {
        if (currentModal) {
            setDismissedZones(prev => new Set(prev).add(currentModal.zoneId));
            setCurrentModal(null);
        }
    };

    return (
        <div>
            <h3>📊 Мониторинг состояния зон хранения</h3>

            {/* === БЛОКИРУЮЩИЙ МОДАЛЬНЫЙ АЛЕРТ === */}
            {currentModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        background: 'white',
                        width: '520px',
                        maxWidth: '92%',
                        borderRadius: '16px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚨</div>
                        <h2 style={{ color: '#c00', margin: '0 0 15px 0' }}>КРИТИЧЕСКОЕ НАРУШЕНИЕ!</h2>

                        <p style={{ fontSize: '1.15em' }}>
                            В зоне <strong>"{currentModal.zoneName}"</strong> обнаружено нарушение
                        </p>

                        <p style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#c00', margin: '20px 0' }}>
                            {currentModal.param === 'temperature' ? '🌡️ Температура' : '💧 Влажность'} — {currentModal.value}
                        </p>

                        <p style={{ color: '#555', marginBottom: '25px' }}>
                            Нормальное значение: <strong>{currentModal.norm}</strong>
                        </p>

                        {currentModal.affectedCargos.length > 0 && (
                            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                                <strong>Затронутые товары:</strong>
                                <ul style={{ marginTop: '8px', paddingLeft: '22px' }}>
                                    {currentModal.affectedCargos.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleTakeAction}
                            style={{
                                backgroundColor: '#c00',
                                color: 'white',
                                border: 'none',
                                padding: '16px 40px',
                                fontSize: '1.1em',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Я приму меры
                        </button>
                    </div>
                </div>
            )}

            {/* Карточки зон (для общего обзора) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '16px',
                marginTop: '20px'
            }}>
                {Object.keys(zones).length === 0 ? (
                    <p>Загрузка данных зон...</p>
                ) : (
                    Object.entries(zones).map(([zoneId, zone]) => {
                        const isCritical = zone.status === 'critical';
                        return (
                            <div key={zoneId} style={{
                                border: isCritical ? '3px solid #c00' : '2px solid #006400',
                                borderRadius: '12px',
                                backgroundColor: isCritical ? '#ffe6e6' : '#e6ffe6',
                                padding: '16px'
                            }}>
                                <h4 style={{ margin: '0 0 8px 0' }}>{zone.name}</h4>
                                <p>🌡️ <strong>{Number(zone.currentTemp).toFixed(1)}°C</strong> •
                                    💧 <strong>{Number(zone.currentHum).toFixed(1)}%</strong></p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ZoneStatusDashboard;