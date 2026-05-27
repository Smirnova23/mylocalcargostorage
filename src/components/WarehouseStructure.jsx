import React from 'react';

const WarehouseStructure = ({ structure, onEditRack, onDeleteRack }) => {
    if (!structure || structure.length === 0) {
        return <p>Нет данных о складе</p>;
    }

    return (
        <div className="warehouse-structure">
            <h2>📦 Структура хранилища</h2>

            {structure.map(warehouse => (
                <details key={warehouse.id} style={{ marginBottom: '15px' }}>
                    <summary style={{
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: '#f0f8f0',
                        borderRadius: '8px'
                    }}>
                        🏬 Склад: {warehouse.name}
                    </summary>

                    <div style={{ marginLeft: '25px', marginTop: '8px' }}>
                        {warehouse.racks?.map(rack => (
                            <details key={rack.id} style={{ marginBottom: '10px' }}>
                                <summary style={{
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    backgroundColor: '#f8f8f8',
                                    borderRadius: '6px'
                                }}>
                                    🗄️ Стеллаж: {rack.name} ({rack.floors} этажей)
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditRack(rack, warehouse.id); }}
                                        style={{ marginLeft: '15px', fontSize: '0.85em' }}
                                    >
                                        Ред.
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Удалить стеллаж ${rack.name}?`)) {
                                                onDeleteRack(rack.id, warehouse.id);
                                            }
                                        }}
                                        style={{ marginLeft: '5px', color: 'red', fontSize: '0.85em' }}
                                    >
                                        Удалить
                                    </button>
                                </summary>

                                <div style={{ marginLeft: '30px', marginTop: '5px' }}>
                                    {rack.shelves?.map(shelf => (
                                        <details key={shelf.id} style={{ marginBottom: '8px' }}>
                                            <summary style={{
                                                cursor: 'pointer',
                                                padding: '6px 10px',
                                                backgroundColor: '#fafafa',
                                                borderRadius: '4px'
                                            }}>
                                                📚 Этаж: {shelf.level}
                                            </summary>

                                            <div style={{ marginLeft: '40px', marginTop: '5px' }}>
                                                {shelf.bins?.map(bin => {
                                                    const occupied = bin.cargos
                                                        ? bin.cargos.reduce((sum, c) => sum + (c.quantity || 0) * (c.volume || 0), 0)
                                                        : 0;
                                                    const fillPercent = bin.max_volume > 0
                                                        ? Math.round((occupied / bin.max_volume) * 100)
                                                        : 0;

                                                    return (
                                                        <div key={bin.id} style={{
                                                            marginBottom: '10px',
                                                            padding: '12px',
                                                            border: '1px dashed #aaa',
                                                            borderRadius: '8px',
                                                            backgroundColor: fillPercent > 80 ? '#ffe6e6' : '#f9f9f9'
                                                        }}>
                                                            <div style={{ fontWeight: 'bold' }}>
                                                                📍 Ячейка: {bin.cell_number}
                                                                <span style={{ marginLeft: '15px', color: '#006400' }}>
                                                                    {bin.zone_name}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '0.9em', color: '#555' }}>
                                                                Габариты: {bin.width}×{bin.height}×{bin.depth} см |
                                                                Объём: {bin.max_volume} см³ |
                                                                <strong style={{ color: fillPercent > 80 ? 'red' : fillPercent > 50 ? 'orange' : 'green' }}>
                                                                    {fillPercent}% заполнено
                                                                </strong>
                                                            </div>

                                                            {bin.cargos && bin.cargos.length > 0 ? (
                                                                <ul style={{ marginTop: '8px' }}>
                                                                    {bin.cargos.reduce((acc, cargo) => {
                                                                        const existing = acc.find(c => c.name === cargo.name);
                                                                        if (existing) existing.quantity += cargo.quantity;
                                                                        else acc.push({ ...cargo });
                                                                        return acc;
                                                                    }, []).map(cargo => (
                                                                        <li key={cargo.id}>
                                                                            {cargo.name} — {cargo.quantity} шт.
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p style={{ color: '#999', fontSize: '0.9em', marginTop: '5px' }}>
                                                                    Нет грузов
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default WarehouseStructure;