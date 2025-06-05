import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase";

import ResultsPage from "@/app/results/page";
import ConfirmationModal from "@/components/UI/Modal/ConfirmationModal";
import SuccessModal from "@/components/UI/Modal/SuccessModal";

import "@/components/UI/Modal/ModalStyles.css";
import "./studentManagement.css";
import "@/components/UI/LoadingOverlay/LoadingOverlay.css";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classFilter, setClassFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("Both");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "students"));
      const list = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        sn: index + 1,
        ...doc.data(),
      }));
      setStudents(list);
      setFiltered(list);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    let result = [...students];
    if (classFilter !== "All") {
      result = result.filter((s) => s.class === classFilter);
    }
    if (deptFilter !== "All") {
      result = result.filter((s) => s.department === deptFilter);
    }
    if (genderFilter !== "Both") {
      result = result.filter((s) => s.gender === genderFilter);
    }

    // Re-assign serial numbers for filtered list
    const reNumbered = result.map((student, index) => ({
      ...student,
      sn: index + 1,
    }));

    setFiltered(reNumbered);
  }, [classFilter, deptFilter, genderFilter, students]);

  const handleResetPassword = async () => {
    try {
      setShowConfirmationModal(false);
      await sendPasswordResetEmail(auth, selectedEmail);
      console.log(`Reset link sent to ${selectedEmail}`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Reset Error:", error);
      alert(`Error sending reset link: ${error.message}`);
    } finally {
      setShowSuccessModal(true);
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      setShowDeleteModal(false);
      // Delete the student document from Firestore
      await deleteDoc(doc(db, "students", studentToDelete.id));
      console.log(`Deleted student: ${studentToDelete.fullName}`);
      // Refresh your list after deletion
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setShowDeleteSuccessModal(true);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="student-management">
      <h1 className="page-title">Student Management</h1>

      <div className="filters">
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="All">All Classes</option>
          <option value="SS1">SS1</option>
          <option value="SS2">SS2</option>
          <option value="SS3">SS3</option>
        </select>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Art">Art</option>
          <option value="Commercial">Commercial</option>
          <option value="Science">Science</option>
        </select>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="Both">Both Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Student ID</th>
            <th>Class</th>
            <th>Department</th>
            <th colSpan="4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((student) => (
            <tr key={student.id}>
              <td>{student.sn}</td>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.gender}</td>
              <td>{student.studentId}</td>
              <td>{student.class}</td>
              <td>{student.department}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedStudent(student); // the full student object
                    setShowResultModal(true);
                  }}
                  className="view"
                >
                  View Result
                </button>
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedEmail(student.email);
                    setShowConfirmationModal(true);
                  }}
                  className="reset"
                >
                  Reset Password
                </button>
              </td>
              <td>
                <button
                  className="delete"
                  onClick={() => {
                    setStudentToDelete(student); // pass full student object
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading ? (
        <p className="loading-text">Fetching students...</p>
      ) : (
        filtered.length === 0 && (
          <p className="no-data">No students found for the selected filters.</p>
        )
      )}

      {showResultModal && selectedStudent && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <ResultsPage
              passedStudent={selectedStudent}
              onClose={() => setShowResultModal(false)}
            />
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <ConfirmationModal
          title="Reset Password"
          message={`Send a password reset link to ${selectedEmail}?`}
          confirmText="Yes, Send Link"
          cancelText="Cancel"
          onConfirm={handleResetPassword}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          title="Password Reset Sent"
          message={`A reset link has been sent to ${selectedEmail}.`}
          primaryLabel="OK"
          secondaryLabel="Close"
          onPrimary={() => {
            setShowSuccessModal(false);
            // maybe additional logic
          }}
          onSecondary={() => setShowSuccessModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${studentToDelete.fullName}? This action cannot be undone!`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setStudentToDelete(null);
          }}
        />
      )}

      {showDeleteSuccessModal && (
        <SuccessModal
          title="Student Permanently Deleted!"
          message={`The selected student together with all his/her associated records has been successfully deleted from the system.`}
          primaryLabel="OK"
          secondaryLabel="Close"
          onPrimary={() => {
            setShowSuccessModal(false);
          }}
          onSecondary={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
