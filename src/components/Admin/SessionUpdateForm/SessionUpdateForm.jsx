import { useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import promoteAndResetStudents from "@/utils/promoteAndResetStudents";

import "./SettingsForm.css"; // Custom styles

const SessionUpdateForm = () => {
  const [newSession, setNewSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!newSession.trim()) {
      setError("Please enter a valid academic session.");
      return;
    }

    const confirmUpdate = confirm(
      `⚠️ This will DELETE all SS3 student records, PROMOTE the others, RESET their exam data, and start a new session with 1ST TERM.\n\nAre you absolutely sure you want to proceed with updating the session to "${newSession}"?`
    );

    if (!confirmUpdate) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const settingsRef = doc(db, "settings", "general");
      const settingsDoc = await getDoc(settingsRef);

      if (!settingsDoc.exists()) {
        // If document doesn't exist, create it with default values
        await setDoc(settingsRef, {
          academicSession: newSession,
          academicTerm: "1ST TERM", // Default term
        });
      } else {
        // If document exists, update it
        await updateDoc(settingsRef, {
          academicSession: newSession,
          academicTerm: "1ST TERM", // Reset term
        });
      }

      // Call the backend logic to update student records
      await promoteAndResetStudents();

      setSuccessMsg("Academic session updated successfully.");
    } catch (err) {
      console.error("Failed to update session:", err);
      setError("Failed to update session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-form-box">
      <h3>Update Academic Session</h3>

      <div className="warning-text">
        ⚠️ This action will:
        <ul>
          <li>Delete all SS3 students (graduated)</li>
          <li>Promote all other students to the next class</li>
          <li>Reset all subject scores and exam statuses</li>
          <li>
            Set term to <strong>1ST TERM</strong>
          </li>
        </ul>
        <strong>Please back up your records before proceeding.</strong>
      </div>

      <input
        type="text"
        placeholder="e.g., 2025/2026"
        value={newSession}
        onChange={(e) => setNewSession(e.target.value)}
        className="session-input"
        disabled={loading}
      />

      <button onClick={handleUpdate} className="update-btn" disabled={loading}>
        {loading ? "Updating..." : "Update Session"}
      </button>

      {successMsg && <p className="success-text">{successMsg}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default SessionUpdateForm;
