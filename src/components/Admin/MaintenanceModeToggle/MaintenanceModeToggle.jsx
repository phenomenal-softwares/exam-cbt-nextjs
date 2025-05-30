'use client';

import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  getDoc, 
  updateDoc, 
  doc, 
  writeBatch 
} from "firebase/firestore";
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
    : "Enable Maintenance Mode? This will mark ALL students' exams as taken.";
  const proceed = confirm(confirmMsg);

  if (!proceed) return;

  setLoading(true);
  setMessage("");

  try {
    const settingsRef = doc(db, "settings", "general");
    await updateDoc(settingsRef, { maintenanceMode: !isEnabled });

    const studentsSnap = await getDocs(collection(db, "students"));
    const batch = writeBatch(db);

    studentsSnap.forEach((docSnap) => {
      const studentRef = doc(db, "students", docSnap.id);
      const subjects = docSnap.data().subjects || [];

      const updatedSubjects = subjects.map((subj) => ({
        ...subj,
        examTaken: !isEnabled // true when enabling, false when disabling
      }));

      batch.update(studentRef, { subjects: updatedSubjects });
    });

    await batch.commit();

    setMessage(
      !isEnabled
        ? "Maintenance mode activated. All students blocked from exams."
        : "Maintenance mode disabled. Students can now take exams."
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
        ⚠️ When activated, students will be blocked from taking exams. All exam statuses will be locked.
      </p>
      <button className="update-btn" onClick={handleToggle} disabled={loading}>
        {loading
          ? "Processing..."
          : isEnabled
          ? "Disable Maintenance Mode"
          : "Enable Maintenance Mode"}
      </button>
      {message && <p className={message.includes("Error") ? "error-text" : "success-text"}>{message}</p>}
    </div>
  );
};

export default MaintenanceModeToggle;
