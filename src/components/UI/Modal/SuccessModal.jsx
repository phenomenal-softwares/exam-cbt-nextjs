"use client";

import React from "react";
import "./ModalStyles.css";

const SuccessModal = ({ title, message, onPrimary, onSecondary, primaryLabel, secondaryLabel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onPrimary} className="confirm-btn">{primaryLabel}</button>
          <button onClick={onSecondary} className="cancel-btn">{secondaryLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
