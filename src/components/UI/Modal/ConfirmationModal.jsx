"use client";

import React from "react";
import "./ModalStyles.css"; // shared styles for modals

const ConfirmationModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Return",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
