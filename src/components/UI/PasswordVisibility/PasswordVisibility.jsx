// components/PasswordVisibility.jsx
import React from "react";
import "./PasswordVisibility.css";

const PasswordVisibility = ({ visible, setVisible }) => {
  return (
    <div className="password-visibility-container">
      <p className="text">Password Visibility</p>
      <div
        className={`toggle-switch ${visible ? "visible" : ""}`}
        onClick={() => setVisible((prev) => !prev)}
        title={visible ? "Hide password" : "Show password"}
      >
        <div className="switch-stick"></div>
      </div>
    </div>
  );
};

export default PasswordVisibility;
