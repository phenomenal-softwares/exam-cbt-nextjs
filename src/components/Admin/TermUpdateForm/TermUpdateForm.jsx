import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { resetAllStudentExamStatus } from "@/utils/resetStudentExamStatus";
import "./SettingsForm.css"; // Your custom styles

const TermUpdateForm = () => {
  const [newTerm, setNewTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!newTerm) {
      setError("Please select a valid academic term.");
      return;
    }

    const confirmUpdate = confirm(
      `⚠️ This will RESET all students' subject scores and exam statuses.\n\nAre you sure you want to change the term to "${newTerm}"?`
    );

    if (!confirmUpdate) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const settingsRef = doc(db, "settings", "general");
      await updateDoc(settingsRef, {
        academicTerm: newTerm,
      });

      await resetAllStudentExamStatus();

      setSuccessMsg("Academic term updated and student exams reset.");
    } catch (err) {
      console.error("Failed to update term:", err);
      setError("Failed to update term. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-form-box">
      <h3>Update Academic Term</h3>

      <div className="warning-text">
        ⚠️ This action will:
        <ul>
          <li>Reset all subject scores to 0</li>
          <li>Set all exam statuses to <strong>not taken</strong></li>
        </ul>
        <strong>Please back up your records before proceeding.</strong>
      </div>

      <select
        value={newTerm}
        onChange={(e) => setNewTerm(e.target.value)}
        className="session-input"
        disabled={loading}
      >
        <option value="">Select Term</option>
        <option value="1ST TERM">1ST TERM</option>
        <option value="2ND TERM">2ND TERM</option>
        <option value="3RD TERM">3RD TERM</option>
      </select>

      <button onClick={handleUpdate} className="update-btn" disabled={loading}>
        {loading ? "Updating..." : "Update Term"}
      </button>

      {successMsg && <p className="success-text">{successMsg}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default TermUpdateForm;
