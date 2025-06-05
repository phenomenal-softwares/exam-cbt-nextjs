"use client";

import React from "react";
import SessionUpdateForm from "@/components/Admin/SessionUpdateForm/SessionUpdateForm";
import TermUpdateForm from "@/components/Admin/TermUpdateForm/TermUpdateForm";
import ChangePasskeyForm from "@/components/Admin/ChangePassKeyForm/ChangePassKeyForm";
import MaintenanceModeToggle from "@/components/Admin/MaintenanceModeToggle/MaintenanceModeToggle";

import "./settings.css";

const AdminSettingsPage = () => {
  return (
    <div className="settings-page">
      <h1 className="page-title">Account Settings</h1>
      <div className="settings-grid">
        <SessionUpdateForm />
        <TermUpdateForm />
        <ChangePasskeyForm />
        <MaintenanceModeToggle />
      </div>
    </div>
  );
};

export default AdminSettingsPage;
