"use client";

import React from "react";
import "./QuestionTableStyles.css";

const QuestionListTable = ({ questions, onDelete }) => {
  return (
    <div className="questions-table-wrapper">
      <h2 className="questions-title">All Questions</h2>
      <table className="questions-table">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Question</th>
            <th>Options</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No questions found for the selected filters.
              </td>
            </tr>
          ) : (
            questions.map((q, index) => (
              <tr key={q.id}>
                <td>{index + 1}</td>
                <td>{q.question}</td>
                <td>
                  <ul className="options-list">
                    {q.options.map((opt, idx) => (
                      <li key={idx}>
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{q.answer}</td>
                <td>
                  <button className="delete-btn" onClick={() => onDelete(q.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionListTable;
