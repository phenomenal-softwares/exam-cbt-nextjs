'use client';
import React, { useState } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./QuestionForm.css"; // Optional: if you want to isolate styles

const subjects = [
  "Mathematics", "English Language", "Physics", "Chemistry", "Biology",
  "Geography", "Agricultural Science", "Government", "Literature", "CRS",
  "Civic Education", "History", "Accounting", "Commerce", "Economics",
  "Marketing", "Office Practice",
];

const classOptions = ["SS1", "SS2", "SS3"];

export default function QuestionForm() {
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const colRef = collection(db, "Questions", classLevel, subject);
      for (const q of questions) {
        if (q.question.trim() && q.options.every(opt => opt.trim()) && q.answer.trim()) {
          await addDoc(colRef, q);
        }
      }

      alert("Questions submitted successfully!");

      // Reset everything
      setSubmitting(false);
      setQuestions([
        { question: "", options: ["", "", "", ""], answer: "" },
        { question: "", options: ["", "", "", ""], answer: "" },
        { question: "", options: ["", "", "", ""], answer: "" },
        { question: "", options: ["", "", "", ""], answer: "" },
        { question: "", options: ["", "", "", ""], answer: "" },
      ]);
    } catch (err) {
      console.error("Error adding questions:", err);
      alert("Failed to submit questions.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h2>Add Questions</h2>

    <div className="class-subject-selection">
      <label>
        Class:
        <select
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          required
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </label>

      <label>
        Subject:
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </label>
      </div>

      {questions.map((q, index) => (
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
