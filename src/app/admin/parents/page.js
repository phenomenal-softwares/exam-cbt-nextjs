"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";

import ParentForm from "@/components/Admin/ParentForm/ParentForm";
import "@/components/Admin/ParentForm/ParentForm.css";

import "./parentsPage.css";

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch parents from Firestore
  useEffect(() => {
    const fetchParentsWithWards = async () => {
      setLoading(true);
      const parentsSnapshot = await getDocs(collection(db, "parents"));
      const parentDocs = parentsSnapshot.docs;

      // Fetch all students once and store in a map
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentMap = {};
      studentsSnapshot.forEach((doc) => {
        studentMap[doc.id] = doc.data();
      });

      // Now map over parents and attach full student details to wards
      const parentList = parentDocs.map((doc) => {
        const data = doc.data();
        const wardsWithDetails = data.wards.map((studentId) => {
          const student = studentMap[studentId];
          return student
            ? {
                fullName: student.fullName,
                class: student.class,
                department: student.department,
              }
            : {
                fullName: "Unknown",
                class: "",
                department: "",
              };
        });

        return {
          id: doc.id,
          ...data,
          wards: wardsWithDetails,
        };
      });

      setParents(parentList);
      setLoading(false);
    };

    fetchParentsWithWards();
  }, []);

  const handleDelete = async (parentId) => {
  const confirm = window.confirm("Are you sure you want to delete this parent?");
  if (!confirm) return;

  try {
    await deleteDoc(doc(db, "parents", parentId));
    alert("Parent deleted successfully.");

    // Optionally re-fetch or filter out the deleted parent locally
    setParents((prev) => prev.filter((p) => p.id !== parentId));
  } catch (err) {
    console.error("Error deleting parent:", err);
    alert("Failed to delete parent. Please try again.");
  }
};

  return (
    <div className="parents-page">
      <div className="top-bar">
        <h2>Parents</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">
          Add Parent
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Fetching parents...</p>
      ) : (
        <table className="parent-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Parent Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Wards</th>
              <th>Pass Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent, index) => (
              <tr key={parent.id}>
                <td>{index + 1}</td>
                <td>{parent.fullName}</td>
                <td>{parent.email}</td>
                <td>{parent.phone}</td>
                <td>
                  {parent.wards.map((ward, i) => (
                    <div key={i}>
                      {ward.fullName} ({ward.class} {ward.department})
                    </div>
                  ))}
                </td>
                <td>{parent.passKey}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(parent.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal with ParentForm */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <ParentForm />
            <button onClick={() => setShowModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
