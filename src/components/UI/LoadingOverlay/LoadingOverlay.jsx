import React from 'react';
import './loadingOverlay.css';

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}
