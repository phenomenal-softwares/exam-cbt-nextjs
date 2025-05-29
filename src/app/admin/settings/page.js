'use client';

import React from 'react';
import SessionUpdateForm from '@/components/Admin/SessionUpdateForm/SessionUpdateForm';
import './settings.css'; // Assuming global or scoped CSS lives here

const AdminSettingsPage = () => {
  return (
    <div className="settings-page">
      <h2 className="settings-header">Account Settings</h2>
      
      {/* Section for Academic Session */}
      <SessionUpdateForm />
      
      {/* We'll add term update and pass key change below later */}
    </div>
  );
};

export default AdminSettingsPage;
