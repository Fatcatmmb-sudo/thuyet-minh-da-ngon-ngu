import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang thuộc phân hệ Vendor vào hệ thống định tuyến
import VendorDashboardPage from '../pages/vendor/VendorDashboardPage';
import NarrationPage from '../pages/vendor/NarrationPage';
import MediaPage from '../pages/vendor/MediaPage';
import StatisticPage from '../pages/vendor/StatisticPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định mở web lên sẽ đá người dùng vào trang Dashboard tổng quan */}
        <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />

        {/* Các tuyến đường dẫn (Routes) chính của phân hệ Vendor */}
        <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
        <Route path="/vendor/narrations/:boothId" element={<NarrationPage />} />
        <Route path="/vendor/media/:boothId" element={<MediaPage />} />
        <Route path="/vendor/stats/:boothId" element={<StatisticPage />} />

        {/* Nếu gõ bậy URL không tồn tại, tự động đá về Dashboard */}
        <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;