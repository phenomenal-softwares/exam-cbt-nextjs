import React from 'react';

const ResultsActions = ({ onCheckResults, onChangePassword, onLogout }) => {
  return (
    <div className="results-actions">
      <button className="btn-secondary" onClick={onCheckResults}>Check Results</button>
      <div className="auth-buttons">
        <button className="btn-outline btn-hover" onClick={onChangePassword}>Change Password</button>
        <button className="btn-danger btn-hover" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ResultsActions;
