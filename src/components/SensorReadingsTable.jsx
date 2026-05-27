import React, { useState, useEffect } from 'react';

const SensorReadingsTable = () => {
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const fetchReadings = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/sensor/latest');
            const data = await res.json();
            setReadings(data);
        } catch (e) {
            console.error('Ошибка загрузки показаний', e);
        }
    };

    const fetchAlerts = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/bin/alerts');
            const data = await res.json();
            setAlerts(data);
        } catch (e) {
            console.error('Ошибка загрузки алертов', e);
        }
    };

    useEffect(() => {
        fetchReadings();
        fetchAlerts();

        const intervalReadings = setInterval(fetchReadings, 7000);
        const intervalAlerts = setInterval(fetchAlerts, 5000);   // алерты чаще

        return () => {
            clearInterval(intervalReadings);
            clearInterval(intervalAlerts);
        };
    }, []);

    const getStatus = (reading) => {
        const { temperature, humidity, default_temp_min, default_temp_max, default_humidity_min, default_humidity_max } = reading;

        let status = 'Норма';
        let color = 'green';

        if (default_temp_min !== null && default_temp_max !== null) {
            if (temperature < default_temp_min || temperature > default_temp_max) {
                status = 'Критично';
                color = 'red';
            }
        }

        if (default_humidity_min !== null && default_humidity_max !== null) {
            if (humidity < default_humidity_min || humidity > default_humidity_max) {
                status = status === 'Критично' ? 'Критично' : 'Превышение';
                color = 'orange';
            }
        }

        return { status, color };
    };

    return (
        <div>
            <h3>📡 Мониторинг датчиков (реальное время)</h3>

            {/* БЛОК АЛЕРТОВ */}
            {alerts.length > 0 && (
                <div style={{
                    background: '#ffe6e6',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '2px solid #c00',
                    whiteSpace: 'pre-line'
                }}>
                    <strong>🚨 ВНИМАНИЕ! Нарушения режимов хранения:</strong>
                    {alerts.map((alert, i) => (
                        <div key={i} style={{ marginTop: '12px', fontSize: '0.95em' }}>
                            {alert.message}
                        </div>
                    ))}
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                <tr style={{ background: '#006400', color: 'white' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Датчик</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Зона</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Температура</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Влажность</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Давление</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Время</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Статус</th>
                </tr>
                </thead>
                <tbody>
                {readings.map(r => {
                    const { status, color } = getStatus(r);
                    return (
                        <tr key={r.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{r.sensor_id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.zone_name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Number(r.temperature).toFixed(1)}°C</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Number(r.humidity).toFixed(1)}%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Number(r.pressure).toFixed(0)}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{r.formatted_time || '—'}</td>
                            <td style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                fontWeight: 'bold',
                                color: color === 'red' ? 'red' : color === 'orange' ? 'orange' : 'green'
                            }}>
                                {status}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default SensorReadingsTable;