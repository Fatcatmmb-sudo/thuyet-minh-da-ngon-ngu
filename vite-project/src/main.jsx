import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes/AppRouter.jsx' // Gọi file điều hướng tổng của dự án
//import './index.css' // File style định dạng tổng (nếu có)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Chạy AppRouter để quản lý chuyển mạch toàn bộ các trang */}
    <AppRouter />
  </React.StrictMode>,
)