import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./ParentDashboard.css";

export default function WardsTable({
  wards, // this is the array of ward UIDs
  selectedStudent,
  setSelectedStudent,
  onDownloadResult, // 🔥 pass this in from parent
}) {
  const [wardsData, setWardsData] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      const fetchedWards = [];
      for (const wardId of wards) {
        const docRef = doc(db, "students", wardId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          fetchedWards.push({ id: wardId, ...docSnap.data() });
        }
      }
      setWardsData(fetchedWards);
    };

    if (wards.length > 0) {
      fetchWards();
    }
  }, [wards]);

  if (wardsData.length === 0) return <p>Fetching wards...</p>;

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
                  onClick={() => onDownloadResult(ward)} // ✅ this now works
                >
                  Download Result
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
