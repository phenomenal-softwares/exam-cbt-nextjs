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
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import ConfirmationModal from "@/components/UI/Modal/ConfirmationModal";
import SuccessModal from "@/components/UI/Modal/SuccessModal";
import LoadingOverlay from "@/components/UI/LoadingOverlay/LoadingOverlay";
import MessageModal from "@/components/UI/Modal/MessageModal";

import { saveMessageToDatabase } from "@/utils/saveMessageToDatabase";

import "../../styles/dashboard.css";
import NoDataError from "@/components/Error/NoDataError";

const DashboardPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
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
            studentId: data.studentId,
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

  const handleSendMessage = async (message) => {
  if (!studentData) return;

  const messageData = {
    name: studentData.fullName,
    class: studentData.className,
    department: studentData.department,
    message,
  };

  await saveMessageToDatabase(messageData);
  setShowMessageModal(false);
  setSuccessModal(true);
};


  const handleChangePassword = () => {
    console.log("Open change password modal or page");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally, show user feedback
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!studentData) {
    return (
      <NoDataError />
    );
  }

  return (
    <main className="main-container">
      <Letterhead currentTerm={"3RD TERM"} currentSession={"2024/2025"} />
      <div className="dashboard-container">
        <h1>Student Dashboard</h1>

        <StudentProfileCard
          photoURL={studentData.photoURL}
          fullName={studentData.fullName}
          studentId={studentData.studentId}
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

        {showMessageModal && (
          <MessageModal
            title="Got anything on your mind? Let's hear from you!"
            confirmText="Send"
            cancelText="Cancel"
            onConfirm={handleSendMessage}
            onCancel={() => setShowMessageModal(false)}
          />
        )}

        <ResultsActions
          onCheckResults={handleCheckResults}
          onChangePassword={handleChangePassword}
          onMessageAdmin={() => setShowMessageModal(true)}
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

        {successModal && (
          <SuccessModal
            title="Message sent succesfully!"
            message="Your message has been received by the admin. Expect our feedback as soon as possible. Thanks!"
            primaryLabel="Okay"
            secondaryLabel="Back"
            onPrimary={() => setSuccessModal(false)}
            onSecondary={() => setSuccessModal(false)}
          />
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
