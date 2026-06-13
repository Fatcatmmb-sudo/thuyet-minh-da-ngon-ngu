import React from 'react';
import styles from './LanguageStatusBadge.module.css';

const LanguageStatusBadge = ({ status }) => {
  // Hàm map trạng thái từ database ra class CSS tương ứng
  const getStatusClass = () => {
    switch (status) {
      case 'success': return styles.success; // Đã dịch
      case 'warning': return styles.warning; // Đang dịch
      case 'danger':  return styles.danger;  // Chưa dịch
      default: return '';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success': return '🟢 Đã dịch tự động';
      case 'warning': return '🟡 Đang xử lý...';
      case 'danger':  return '🔴 Chưa dịch';
      default: return 'Không xác định';
    }
  };

  return (
    <span className={`${styles.badge} ${getStatusClass()}`}>
      {getStatusText()}
    </span>
  );
};

export default LanguageStatusBadge;