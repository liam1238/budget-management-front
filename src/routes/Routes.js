import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Table from '../pages/Table/Table';
import DetailsPage from '../pages/DetailsPage/DetailsPage';  

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/table/*" element={<Table />} >
                <Route path="expense/:id" element={<DetailsPage type={"expense"}/>} />
                <Route path="income/:id" element={<DetailsPage type={"income"}/>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
