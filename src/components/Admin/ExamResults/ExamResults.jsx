"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { getGradeAndRemark } from "@/utils/getGradeAndRemark";

import "./ExamResults.css";

const classOptions = ["SS1", "SS2", "SS3"];
const subjectOptions = [
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

export default function ExamResults() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allTaken, setAllTaken] = useState(true); // Track if all students have taken the exam
  const [sortedByScore, setSortedByScore] = useState(false); // Track if sorting by score is active
  const [total, setTotal] = useState(20);

  const handleFetchResults = async () => {
    if (!selectedClass || !selectedSubject) return;
    setLoading(true);

    try {
      // Step 1: Fetch totalQuestions from config
      const configRef = doc(
        db,
        `Questions/${selectedClass}/${selectedSubject}/config`
      );
      const configSnap = await getDoc(configRef);
      const totalQuestions =
        configSnap.exists() && configSnap.data()?.totalQuestions
          ? configSnap.data().totalQuestions
          : 20;

      // Step 2: Fetch students and filter
      const querySnapshot = await getDocs(collection(db, "students"));
      const filtered = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.class === selectedClass) {
          const subjectObj = data.subjects?.find(
            (subj) => subj.name === selectedSubject
          );
          if (subjectObj) {
            const score =
              subjectObj.examTaken === true ? subjectObj.score : "Nil";
            filtered.push({
              name: data.fullName,
              score: score,
            });
          }
        }
      });

      const allHaveTakenExam = filtered.every(
        (student) => student.score !== "Nil"
      );
      setAllTaken(allHaveTakenExam);

      // Save results and totalQuestions
      const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(sorted);
      setTotal(totalQuestions); // <- Add this state next
    } catch (err) {
      console.error("Error fetching results or config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortByScore = () => {
    if (!allTaken) return;

    if (sortedByScore) {
      // Sort back to name order
      const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name));
      setStudents(sorted);
      setSortedByScore(false);
    } else {
      const sorted = [...students].sort((a, b) => b.score - a.score);
      setStudents(sorted);
      setSortedByScore(true);
    }
  };

  useEffect(() => {
    handleFetchResults();
  }, [selectedClass, selectedSubject]);

  return (
    <div className="exam-results-container">
      <h1 className="page-title">Exam Results</h1>

      <div className="filters">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjectOptions.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      <div className="results-info">
        {selectedClass && selectedSubject && (
          <p>
            Showing results for <strong>{selectedSubject}</strong> in{" "}
            <strong>{selectedClass}</strong>
          </p>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="no-results">No students match the selected criteria.</p>
      ) : (
        <>
          <button
            onClick={handleSortByScore}
            className="sort-button"
            disabled={!allTaken}
          >
            {sortedByScore ? "Sort by Name" : "Sort by Score"}
          </button>

          <table className="results-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>STUDENT</th>
                <th>SCORE</th>
                <th>TOTAL</th>
                <th>PERCENTAGE</th>
                <th>GRADE</th>
                <th>REMARK</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => {
                const { grade, remark } =
                  s.score !== "Nil"
                    ? getGradeAndRemark(s.score, total)
                    : { grade: "Nil", remark: "Nil" };

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.score}</td>
                    <td>{total}</td>
                    <td>
                      {s.score !== "Nil"
                        ? `${((s.score / total) * 100).toFixed(1)}%`
                        : "Nil"}
                    </td>
                    <td>{grade}</td>
                    <td>{remark}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
