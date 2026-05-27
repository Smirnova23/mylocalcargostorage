import React, { useState } from 'react';
import './App.css';
import useWarehouseApi from './hooks/useWarehouseApi';
import ErrorMessage from './components/ErrorMessage';
import WarehouseStructure from './components/WarehouseStructure';
import AddCargoForm from './components/AddCargoForm';
import CargoSearch from './components/CargoSearch';
import GenerateBinQR from './components/GenerateBinQR';
import ForecastDisplay from "./components/ForecastDisplay.jsx";
import SensorReadingsTable from './components/SensorReadingsTable';
import ProductCharacteristicsTable from './components/ProductCharacteristicsTable';
import ZoneStatusDashboard from './components/ZoneStatusDashboard';
import MainTabs from './components/MainTabs';

function App() {
    const { structure, error, createRack, updateRack, deleteRack, deleteCargo, createCargo, assignCargoToBin, searchCargo, getBinQRUrl } = useWarehouseApi();

    return (
        <div style={{ padding: '20px' }}>
            <ErrorMessage error={error} />

            <h1 style={{ marginBottom: '10px' }}>Складской учёт</h1>


            <div >
                <ZoneStatusDashboard />
            </div>

            <MainTabs>

                <WarehouseStructure
                    structure={structure}
                    onEditRack={() => {}}
                    onDeleteRack={() => {}}
                />

                <div>
                    <AddCargoForm structure={structure} />
                    <GenerateBinQR structure={structure} onGetQRUrl={getBinQRUrl} />
                </div>


                <div>
                    <SensorReadingsTable />
                    <div style={{ marginTop: '60px', padding: '20px', border: '2px solid #006400', borderRadius: '12px', backgroundColor: '#f8fff8' }}>
                        <h3>📋 Параметры хранения товаров</h3>
                        <ProductCharacteristicsTable />
                    </div>
                </div>


                <ForecastDisplay />


                <CargoSearch onSearch={searchCargo} onDelete={deleteCargo} />
            </MainTabs>
        </div>
    );
}

export default App;