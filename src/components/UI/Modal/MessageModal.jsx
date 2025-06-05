import React, { useState } from "react";
import "./ModalStyles.css";

const MessageModal = ({
  title,
  onConfirm,
  onCancel,
  studentInfo, // { name, class, department }
}) => {
  const [message, setMessage] = useState("");
  const charLimit = 250;

  const handleChange = (e) => {
    const input = e.target.value;
    if (input.length <= charLimit) {
      setMessage(input);
    }
  };

  const handleSubmit = () => {
    if (message.trim() && message.length <= charLimit) {
      onConfirm(message.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="title">{title}</h3>
        <textarea
          className="message-textarea"
          value={message}
          onChange={handleChange}
          placeholder="Type your message here..."
          rows={4}
          cols={50}
        />

        {/* Character counter */}
        <div className="char-count">
          {message.length} / {charLimit}
        </div>

        <div className="modal-buttons">
          <button
            className="confirm-btn"
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            Send
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
