import React from "react";
import "./Letterhead.css";

const Letterhead = ({ currentTerm, currentSession }) => {
  return (
    <div className="letterhead">
      <div className="logo-container">
        <img
          src="/images/school-logo.png"
          alt="School Logo"
          width={100}
          height={100}
          className="school-logo"
        />
      </div>
      <div className="letterhead-text">
        <h1 className="school-name">DOLAPO HIGH SCHOOL</h1>
        <p className="school-address">
          P.M.B 2317, ASA DAM, ILORIN, KWARA STATE
        </p>
        <p className="exam-details">
          {currentTerm} {currentSession} COMPUTER-BASED EXAM PORTAL
        </p>
      </div>
    </div>
  );
};

export default Letterhead;
