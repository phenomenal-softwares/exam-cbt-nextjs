"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import SuccessModal from "@/components/UI/Modal/SuccessModal";
import { useRouter } from "next/navigation";
import { updateSubjectExamStatus } from "@/utils/updateSubjectExamStatus";

import "./ExamPage.css";

const ExamPage = ({ subject, classLevel, name, uid }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState(Array(20).fill(null));
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(
          db,
          `Questions/${classLevel}/${subject}`
        );
        const querySnapshot = await getDocs(questionsRef);
        const allQuestions = querySnapshot.docs.map((doc) => doc.data());

        // Randomize and select 20 questions
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 20);
        setQuestions(selected);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subject && classLevel) {
      fetchQuestions();
    }
  }, [subject, classLevel]);

  useEffect(() => {
    if (submitted) return; // Don't run timer if exam already submitted

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleSubmit(); // auto-submit
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // clean up
  }, [submitted]);

  const handleAnswerSelect = (index, selectedOption) => {
    const updatedAnswers = [...studentAnswers];
    updatedAnswers[index] = selectedOption;
    setStudentAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    let score = 0;

    questions.forEach((question, index) => {
      if (studentAnswers[index] === question.answer) {
        score += 1;
      }
    });

    try {
      await updateSubjectExamStatus(uid, subject, score);

      setSubmitted(true);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to save exam:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleLogout = () => {
    console.log("Logout function called");
  };

  if (loading) return <p>Loading questions...</p>;
  if (!questions.length) return <p>No questions found for this exam.</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>Exam: {subject}</h2>
        <p>Time Left: {formatTime(timeLeft)}</p>
      </div>

      <div className="question-card">
        <h4>Question {currentQuestionIndex + 1}</h4>
        <p>{currentQuestion.question}</p>

        <div className="options">
          {currentQuestion.options.map((option, idx) => (
            <label key={idx} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={studentAnswers[currentQuestionIndex] === option}
                onChange={() =>
                  handleAnswerSelect(currentQuestionIndex, option)
                }
              />
              {String.fromCharCode(65 + idx)}. {option}
            </label>
          ))}
        </div>
      </div>

      {/* Prev and Next Buttons */}
      <div className="prev-next-buttons">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="nav-btn"
        >
          Prev
        </button>

        <button
          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
          className="nav-btn"
        >
          Next
        </button>
      </div>

      {/* Question Navigation Buttons */}
      <div className="question-nav-buttons">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`question-nav-button ${
              studentAnswers[index] !== null ? "answered" : "unanswered"
            } ${index === currentQuestionIndex ? "active" : ""}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={studentAnswers.includes(null) || submitted}
        className="submit-btn"
      >
        Submit
      </button>

      {/* Success modal */}
      {showModal && (
        <SuccessModal
          title="Exam Submitted Successfully"
          message={`Dear ${name.toUpperCase()}, you have successfully submitted your ${subject.toUpperCase()} exam. Your result will be available on your dashboard shortly!`}
          primaryLabel="Go to Dashboard"
          onPrimary={() => router.push("/dashboard")}
          secondaryLabel="Logout"
          onSecondary={handleLogout}
        />
      )}
    </div>
  );
};

export default ExamPage;
