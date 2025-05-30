import { useState } from "react";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import "./SettingsForm.css";

const ChangePasskeyForm = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = async () => {
    setSuccessMsg("");
    setError("");

    if (!oldPass || !newPass || !confirmPass) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("New passkeys do not match.");
      return;
    }

    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Re-authenticate with old password
      const credential = EmailAuthProvider.credential(user.email, oldPass);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPass);
      setSuccessMsg("Passkey updated successfully.");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      console.error("Failed to update passkey:", err);
      setError(err.message.includes("auth/wrong-password")
        ? "Old passkey is incorrect."
        : "Failed to update passkey. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-form-box">
      <h3>Change Admin Passkey</h3>

      <input
        type="password"
        placeholder="Old Passkey"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        className="session-input"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="New Passkey"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        className="session-input"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Confirm New Passkey"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        className="session-input"
        disabled={loading}
      />

      <button onClick={handleChange} className="update-btn" disabled={loading}>
        {loading ? "Updating..." : "Change Passkey"}
      </button>

      {successMsg && <p className="success-text">{successMsg}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ChangePasskeyForm;
