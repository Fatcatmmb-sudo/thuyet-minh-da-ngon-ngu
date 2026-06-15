import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/visitor/LandingPage';
import LocationPage from '../pages/visitor/LocationPage';
import MapPage from '../pages/visitor/MapPage';
import BoothPage from '../pages/visitor/BoothPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-100 flex justify-center items-start">
        <div className="w-full max-w-md min-h-screen bg-white shadow-2xl flex flex-col relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/booth/:boothId" element={<BoothPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;