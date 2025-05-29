"use client";

import React, { useState, useEffect } from "react";
import QuestionListTable from "@/components/admin/Questions/QuestionListTable";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import QuestionForm from "@/components/admin/Questions/QuestionForm";
import ConfirmationModal from "@/components/UI/Modal/ConfirmationModal";
import SuccessModal from "@/components/UI/Modal/SuccessModal";

import "./QuestionManagementStyles.css";
import "@/components/UI/Modal/ModalStyles.css";
import "@/components/Admin/Questions/QuestionForm.css";

const classes = ["SS1", "SS2", "SS3"];
const subjects = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "Agricultural Science",
  "Government",
  "Literature",
  "CRS",
  "Civic Education",
  "History",
  "Accounting",
  "Commerce",
  "Economics",
  "Marketing",
  "Office Practice",
];

const QuestionManagement = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchQuestions = async () => {
    if (!selectedClass || !selectedSubject) return;

    setLoading(true);
    try {
      const questionsRef = collection(
        db,
        "Questions",
        selectedClass,
        selectedSubject
      );
      const querySnapshot = await getDocs(questionsRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedClass, selectedSubject]);

  const handleDeleteClick = (id) => {
    setSelectedQuestionId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuestionId || !selectedClass || !selectedSubject) return;
    try {
      const questionRef = doc(
        db,
        "Questions",
        selectedClass,
        selectedSubject,
        selectedQuestionId
      );
      await deleteDoc(questionRef);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setSelectedQuestionId(null);
      fetchQuestions(); // refresh the data
    } catch (err) {
      console.error("Failed to delete:", err);
      // optionally show error modal
    }
  };

  const handleDeleteAllQuestions = async () => {
    if (!selectedClass || !selectedSubject) {
      alert("Select both class and subject first.");
      return;
    }

    const confirm = window.confirm(
      `This will permanently delete ALL questions for ${selectedClass} / ${selectedSubject}. Are you sure?`
    );
    if (!confirm) return;

    try {
      const questionsRef = collection(
        db,
        "Questions",
        selectedClass,
        selectedSubject
      );
      const snapshot = await getDocs(questionsRef);

      const deletePromises = snapshot.docs.map((docItem) =>
        deleteDoc(docItem.ref)
      );
      await Promise.all(deletePromises);

      // Optionally refresh state
      fetchQuestions(); // Make sure you already have this in your component

      alert("All questions deleted successfully.");
    } catch (error) {
      console.error("Error deleting all questions:", error);
      alert("Failed to delete questions.");
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="qm-wrapper">
      <h1 className="qm-title">Question Management</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Choose Class --</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Select Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className="primary-btn"
            onClick={() => setShowAddQuestionModal(true)}
            disabled={!selectedClass || !selectedSubject}
          >
            Add Questions
          </button>
        </div>

        <div>
          <button
            className="danger-btn"
            onClick={handleDeleteAllQuestions}
            disabled={!selectedClass || !selectedSubject}
          >
            Delete All Questions
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Fetching questions...</p>
      ) : (
        <QuestionListTable
          questions={questions}
          className={selectedClass}
          subject={selectedSubject}
          onDelete={handleDeleteClick}
        />
      )}

      {showAddQuestionModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <button onClick={() => setShowAddQuestionModal(false)} className="cancel-btn">
            Cancel
          </button>
          <QuestionForm
            classLevel={selectedClass}
            subject={selectedSubject}
            onSubmitComplete={() => {
              fetchQuestions();
              setShowAddQuestionModal(false);
            }}
          />
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this question?"
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          title="Deleted"
          message="The question has been successfully deleted."
          primaryLabel="OK"
          onPrimary={closeSuccessModal}
          secondaryLabel=""
          onSecondary={() => {}}
        />
      )}
    </div>
  );
};

export default QuestionManagement;
