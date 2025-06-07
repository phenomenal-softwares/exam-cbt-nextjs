"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import SuccessModal from "@/components/UI/Modal/SuccessModal";
import { useRouter } from "next/navigation";
import { updateSubjectExamStatus } from "@/utils/updateSubjectExamStatus";
import { getConfigForSubject } from "@/utils/getConfigForSubject";
import LoadingOverlay from "../UI/LoadingOverlay/LoadingOverlay";
import ConfirmationModal from "../UI/Modal/ConfirmationModal";
import Letterhead from "../UI/Letterhead/Letterhead";

import "./ExamPage.css";

const ExamPage = ({ subject, classLevel, name, uid }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState(Array(20).fill(null));
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();

  useEffect(() => {
  const fetchConfigAndQuestions = async () => {
    if (!subject || !classLevel) return;

    try {
      setLoading(true);

      const { totalQuestions, timeLimit } = await getConfigForSubject(classLevel, subject);

      // Fetch all questions (excluding the config doc)
      const questionsRef = collection(db, `Questions/${classLevel}/${subject}`);
      const querySnapshot = await getDocs(questionsRef);

      const allQuestions = querySnapshot.docs
        .filter(doc => doc.id !== "config")
        .map(doc => doc.data());

      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, totalQuestions);

      setQuestions(selected);
      setStudentAnswers(Array(totalQuestions).fill(null));
      setTimeLeft(timeLimit * 60);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchConfigAndQuestions();
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
      setShowConfirmation(false);
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

  if (loading) return <LoadingOverlay />;
  if (!questions.length) return <p className="no-data">No questions found for this exam. Please contact the admin.</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="main-container">
      <Letterhead />
      <div className="exam-container">
        <div className="exam-header">
          <h3>{name}</h3>
          <h3>Subject: {subject}</h3>
          <h3>Class: {classLevel}</h3>
        </div>
        <p className="timer">Time Left: {formatTime(timeLeft)}</p>

        <div className="question-card">
          <h4>Question {currentQuestionIndex + 1}</h4>
          <p>{currentQuestion.question}</p>

          <div className="options">
            {currentQuestion.options.map((option, idx) => (
              <label key={idx}>
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

        {/* Submit Button */}
        <div className="submit-container">
          <button
            onClick={() => setShowConfirmation(true)}
            disabled={studentAnswers.includes(null) || submitted}
            className="submit-btn"
          >
            Submit Exam
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <ConfirmationModal
            title="Confirm Submission"
            message="Are you sure you want to submit your exam? This action cannot be undone."
            confirmText="Yes, Submit Exam"
            cancelText="No, Return to Exam"
            onConfirm={handleSubmit}
            onCancel={() => setShowConfirmation(false)}
          />
        )}

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
    </div>
  );
};

export default ExamPage;
