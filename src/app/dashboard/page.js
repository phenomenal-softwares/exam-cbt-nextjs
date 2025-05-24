"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import StudentProfileCard from "@/components/dashboard/StudentProfileCard";
import StudentDetailsGrid from "@/components/dashboard/StudentDetailsGrid";
import SubjectsTable from "@/components/dashboard/SubjectsTable";
import ResultsActions from "@/components/dashboard/ResultsActions";
import Letterhead from "@/components/Letterhead/Letterhead";
import ConfirmationModal from "@/components/UI/Modal/ConfirmationModal";

import "../../styles/dashboard.css";

const DashboardPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const router = useRouter();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const data = studentSnap.data();
          setStudentData({
            photoURL: data.photoURL,
            fullName: data.fullName,
            email: data.email,
            className: data.class,
            department: data.department,
            examId: data.examId,
            subjects: data.subjects || [],
          });
        } else {
          console.warn("No student document found for UID:", user.uid);
          setStudentData(null);
        }
      } else {
        console.warn("User not logged in.");
        setStudentData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // clean up
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentData) {
    return <div>No student data available</div>;
  }

  const handleTakeExam = (subject) => {
    const encodedSubject = encodeURIComponent(subject.name);
    const encodedClass = encodeURIComponent(studentData.className);
    const encodedName = encodeURIComponent(studentData.fullName);
    const encodedUID = encodeURIComponent(auth.currentUser.uid);

    router.push(
      `/exam?subject=${encodedSubject}&classLevel=${encodedClass}&name=${encodedName}&uid=${encodedUID}`
    );
  };

  const handleCheckResults = () => {
    router.push("/results");
  };

  const handleChangePassword = () => {
    console.log("Open change password modal or page");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally, show user feedback
    }
  };

  return (
    <main className="main-container">
      <div className="dashboard-container">
        <Letterhead currentTerm={"3RD TERM"} currentSession={"2024/2025"} />

        <h1>Student Dashboard</h1>

        <StudentProfileCard
          photoURL={studentData.photoURL}
          fullName={studentData.fullName}
          examId={studentData.examId}
        />

        <StudentDetailsGrid
          email={studentData.email}
          className={studentData.className}
          department={studentData.department}
        />

        <SubjectsTable
          subjects={studentData.subjects}
          onTakeExam={handleTakeExam}
        />

        <ResultsActions
          onCheckResults={handleCheckResults}
          onChangePassword={handleChangePassword}
          onLogout={() => setConfirmationModal(true)}
        />

        {confirmationModal && (
          <ConfirmationModal
            title="Log Out"
            message="Are you sure you want to log out?"
            confirmText="Log out"
            cancelText="Cancel"
            onConfirm={handleLogout}
            onCancel={() => setConfirmationModal(false)}
          />
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
