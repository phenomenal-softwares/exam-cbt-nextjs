import React from "react";
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import "./NoDataError.css";

const NoDataError = () => (
  <div className="main-container">
    <Letterhead />
    <div className="error-container">
      <h2 className="error-title">No Student Data Found</h2>
      <p>
        We couldn't find any student data to display. Please check your login
        credentials or ensure that your account has been set up correctly. If
        the problem persists, please contact the exam admin.
      </p>
      <p>You are being redirected to the login page immediately</p>
    </div>
  </div>
);

export default NoDataError;
