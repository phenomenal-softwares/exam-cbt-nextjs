'use client';

import { useEffect, useState } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import "./SettingsForm.css";

const MaintenanceModeToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const settingsRef = doc(db, "settings", "general");
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
          setIsEnabled(!!snap.data().maintenanceMode);
        }
      } catch (err) {
        console.error("Failed to fetch maintenance status:", err);
      }
    };

    fetchStatus();
  }, []);

  const handleToggle = async () => {
    const confirmMsg = isEnabled
      ? "Disable Maintenance Mode and allow exams again?"
      : "Enable Maintenance Mode? This will temporarily block access to exams.";
    const proceed = confirm(confirmMsg);

    if (!proceed) return;

    setLoading(true);
    setMessage("");

    try {
      const settingsRef = doc(db, "settings", "general");
      await updateDoc(settingsRef, { maintenanceMode: !isEnabled });

      setMessage(
        !isEnabled
          ? "Maintenance mode activated. Students are now blocked from taking exams."
          : "Maintenance mode disabled. Exams are now accessible to students."
      );

      setIsEnabled(!isEnabled);
    } catch (err) {
      console.error("Maintenance mode error:", err);
      setMessage("Error updating maintenance mode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-form-box">
      <h3>Maintenance Mode {isEnabled ? '(On)' : '(Off)'}</h3>
      <p className="warning-text">
        ⚠️ When activated, students will be blocked from taking exams. Their status won't be updated, but the button will be disabled.
      </p>
      <button className="update-btn" onClick={handleToggle} disabled={loading}>
        {loading
          ? "Processing..."
          : isEnabled
          ? "Disable Maintenance Mode"
          : "Enable Maintenance Mode"}
      </button>
      {message && (
        <p className={message.includes("Error") ? "error-text" : "success-text"}>
          {message}
        </p>
      )}
    </div>
  );
};

export default MaintenanceModeToggle;
