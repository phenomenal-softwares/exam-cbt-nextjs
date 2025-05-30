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
      <h2 className="settings-header">Account Settings</h2>

      {/* Section for Academic Session */}
      <SessionUpdateForm />

      {/* Section for Academic Term */}
      <TermUpdateForm />

      {/* Section for Change Passkey */}
      <ChangePasskeyForm />

      {/* Section for Maintenance Mode */}
      <MaintenanceModeToggle />
    </div>
  );
};

export default AdminSettingsPage;
