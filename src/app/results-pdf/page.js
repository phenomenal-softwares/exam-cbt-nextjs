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

export default function ResultsPdf({
  passedStudent = null,
  onClose = null,
  isExport = false,
}) {
  const router = useRouter();
  const [student, setStudent] = useState(passedStudent || null);
  const [loading, setLoading] = useState(!passedStudent); // skip loading if prop was passed

  // Fetch the subject configurations (e.g., totalQuestions) dynamically
  const [subjectConfig, setSubjectConfig] = useState({});

  useEffect(() => {
    // Fetch subject configuration from Firestore for the totalQuestions
    const fetchSubjectConfig = async (subject) => {
      try {
        const docRef = doc(
          db,
          `Questions/${student.class}/${subject}`,
          "config"
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSubjectConfig((prevState) => ({
            ...prevState,
            [subject]: docSnap.data(),
          }));
        } else {
          // Fallback to default values if no config is found
          setSubjectConfig((prevState) => ({
            ...prevState,
            [subject]: { totalQuestions: 20, timeLimit: 900 },
          }));
        }
      } catch (error) {
        console.error("Error fetching subject config:", error);
      }
    };

    if (student) {
      student.subjects.forEach((subject) => {
        fetchSubjectConfig(subject.name);
      });
    }
  }, [student]);

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

  ResultsPdf.defaultProps = {
    passedStudent: null,
  };

  const handleDownloadPDF = async () => {
  const element = document.getElementById("pdf-container");
  if (!element) return;

  const html2canvas = (await import("html2canvas")).default;
  const jsPDF = (await import("jspdf")).jsPDF;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const maxHeight = pdf.internal.pageSize.getHeight();
  const finalHeight = Math.min(pdfHeight, maxHeight); // Prevent too tall pages

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
  pdf.save(`${student.fullName}_Result.pdf`);
};


  if (loading) return <LoadingOverlay />;

  if (!student) {
    return <NoDataError />;
  }

  return (
    <div className="main-container">
      <div id="pdf-container">
        <Letterhead />
        <div className="results-container">
          <h3 className="results-title">STUDENT RESULTS</h3>
          {/* Profile Card */}
          <div className="profile-card">
            <img
              src={student.photoURL}
              alt="Student"
              className="student-photo"
            />
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
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((subject, index) => {
                  const { name, score, examTaken } = subject;
                  const config = subjectConfig[name] || { totalQuestions: 20 }; // Fallback to 20 if not found
                  const totalQuestions = config.totalQuestions;

                  if (!examTaken) {
                    return (
                      <tr key={index}>
                        <td>{name}</td>
                        <td>Nil</td>
                        <td>Nil</td>
                        <td>Nil</td>
                        <td>Nil</td>
                        <td>Nil</td>
                      </tr>
                    );
                  }

                  const percentage = ((score / totalQuestions) * 100).toFixed(
                    2
                  );
                  const { grade, remark } = getGradeAndRemark(
                    score,
                    totalQuestions
                  );
                  return (
                    <tr key={index}>
                      <td>{name}</td>
                      <td>{score}</td>
                      <td>{totalQuestions}</td>
                      <td>{percentage}%</td>
                      <td>{grade}</td>
                      <td>{remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      {!isExport && (
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

          <button onClick={handleDownloadPDF} className="btn print-btn">
            Download Result
          </button>
        </div>
      )}
    </div>
  );
}
