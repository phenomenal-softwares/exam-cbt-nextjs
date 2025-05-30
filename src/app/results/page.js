"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { auth } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getGradeAndRemark } from "@/utils/getGradeAndRemark";
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import LoadingOverlay from "@/components/UI/LoadingOverlay/LoadingOverlay";
import NoDataError from "@/components/Error/NoDataError";

import "./results.css";

export default function ResultsPage({ passedStudent = null, onClose = null }) {
  const router = useRouter();
  const [student, setStudent] = useState(passedStudent || null);
  const [loading, setLoading] = useState(!passedStudent); // skip loading if prop was passed

  useEffect(() => {
    // if student already passed from admin, skip fetching
    if (passedStudent) return;

    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/login");
          return;
        }

        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          console.error("No student data found.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [router, passedStudent]);

  ResultsPage.defaultProps = {
    passedStudent: null,
  };

  if (loading) return <LoadingOverlay />;

  if (!student) {
    return <NoDataError />;
  }

  return (
    <div className="main-container">
      <Letterhead />
      <div className="results-container">
        <h3 className="results-title">STUDENT RESULTS</h3>
        {/* Profile Card */}
        <div className="profile-card">
          <img src={student.photoURL} alt="Student" className="student-photo" />
          <div>
            <h2 className="student-name">{student.fullName}</h2>
            <p className="student-email">{student.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="details-grid">
          <div>
            <strong>Class:</strong> {student.class}
          </div>
          <div>
            <strong>Department:</strong> {student.department}
          </div>
          <div>
            <strong>Student ID:</strong> {student.studentId}
          </div>
        </div>

        {/* Results Table */}
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subject, index) => {
                const { name, score, examTaken } = subject;
                if (!examTaken) {
                  return (
                    <tr key={index}>
                      <td>{name}</td>
                      <td>Nil</td>
                      <td>Nil</td>
                      <td>Nil</td>
                      <td>Nil</td>
                    </tr>
                  );
                }
                const { grade, remark } = getGradeAndRemark(score);
                return (
                  <tr key={index}>
                    <td>{name}</td>
                    <td>{score}</td>
                    <td>20</td>
                    <td>{grade}</td>
                    <td>{remark}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="results-buttons">
          {onClose ? (
            <button onClick={onClose} className="btn back-btn">
              Close
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="btn back-btn"
            >
              Back to Dashboard
            </button>
          )}

          <button onClick={() => window.print()} className="btn print-btn">
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
