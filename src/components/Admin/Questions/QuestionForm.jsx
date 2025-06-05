'use client';
import React, { useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import "./QuestionForm.css";

export default function QuestionForm({ classLevel, subject, onSubmitComplete }) {
  const [submitting, setSubmitting] = useState(false);
   const [bulkQuestions, setBulkQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const handleQuestionChange = (index, field, value) => {
  const updatedQuestions = [...bulkQuestions];
  updatedQuestions[index][field] = value;
  setBulkQuestions(updatedQuestions);
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!classLevel || !subject) {
    alert("Class and subject are required");
    return;
  }

  setSubmitting(true);

  try {
    const colRef = collection(db, "Questions", classLevel, subject);

    // ✅ Check or create config
    const configRef = doc(db, "Questions", classLevel, subject, "config");
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      await setDoc(configRef, {
        totalQuestions: 20,
        timeLimit: 15,
      });
      console.log("Default config created");
    }

    // ✅ Add questions
    for (const q of bulkQuestions) {
      if (q.question.trim() && q.options.every(opt => opt.trim()) && q.answer.trim()) {
        await addDoc(colRef, q);
      }
    }

    alert("Questions submitted successfully!");
    if (onSubmitComplete) onSubmitComplete();

    // Reset form
    setBulkQuestions([
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  } catch (err) {
    console.error("Error adding questions:", err);
    alert("Failed to submit questions.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h2>Add Questions</h2>
      <p><strong>Class:</strong> {classLevel}</p>
      <p><strong>Subject:</strong> {subject}</p>

      {bulkQuestions.map((q, index) => (
        <div key={index} className="question-block">
          <h4>Question {index + 1}</h4>
          <label>
            Question:
            <textarea
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(index, "question", e.target.value)
              }
              required
            />
          </label>

          {["A", "B", "C", "D"].map((letter, i) => (
            <label key={i}>
              Option {letter}:
              <input
                type="text"
                value={q.options[i]}
                onChange={(e) => {
                  const newOptions = [...q.options];
                  newOptions[i] = e.target.value;
                  handleQuestionChange(index, "options", newOptions);
                }}
                required
              />
            </label>
          ))}

          <label>
            Correct Option:
            <select
              value={q.answer}
              onChange={(e) =>
                handleQuestionChange(index, "answer", e.target.value)
              }
              required
            >
              <option value="">Select Correct Option</option>
              {q.options.map((opt, i) => (
                <option key={i} value={opt}>
                  Option {String.fromCharCode(65 + i)}: {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}

      <button type="submit" disabled={submitting} className={submitting ? "disable-button" : "submit-button"}>
        {submitting ? "Submitting..." : "Submit Questions"}
      </button>
    </form>
  );
}
