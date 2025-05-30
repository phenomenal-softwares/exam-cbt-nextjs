import { useEffect, useState } from "react";
import { db } from "@/services/firebase"; // Firebase config
import { doc, getDoc } from "firebase/firestore";

import './ParentDashboard.css'

export default function WardsTable({ wardIds, onViewResults }) {
  const [wardsData, setWardsData] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      const wards = [];
      for (const wardId of wardIds) {
        const docRef = doc(db, "students", wardId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          wards.push({ id: wardId, ...docSnap.data() });
        }
      }
      setWardsData(wards);
    };

    if (wardIds.length > 0) {
      fetchWards();
    }
  }, [wardIds]);

  if (wardsData.length === 0) return <p>No wards found.</p>;

  return (
    <div className="wards-table-container">
      <table className="wards-table">
        <thead>
          <tr>
            <th>Your Ward(s)</th>
            <th>Gender</th>
            <th>Student ID</th>
            <th>Class</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {wardsData.map((ward) => (
            <tr key={ward.id}>
              <td>{ward.fullName}</td>
              <td>{ward.gender}</td>
              <td>{ward.studentId}</td>
              <td>{ward.class}</td>
              <td>{ward.department}</td>
              <td>
                <button
                  className="view-results-btn"
                  onClick={() => onViewResults(ward)}
                >
                  View Results
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
