"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import StudentProfileCard from "@/components/Dashboard/StudentProfileCard";
import StudentDetailsGrid from "@/components/Dashboard/StudentDetailsGrid";
import SubjectsTable from "@/components/Dashboard/SubjectsTable";
import ResultsActions from "@/components/Dashboard/ResultsActions";
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import ConfirmationModal from "@/components/UI/Modal/ConfirmationModal";
import SuccessModal from "@/components/UI/Modal/SuccessModal";
import LoadingOverlay from "@/components/UI/LoadingOverlay/LoadingOverlay";
import MessageModal from "@/components/UI/Modal/MessageModal";

import { saveMessageToDatabase } from "@/utils/saveMessageToDatabase";
import NoDataError from "@/components/Error/NoDataError";

import "../../styles/dashboard.css";

const DashboardPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
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
            gender: data.gender,
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

      // Fetch maintenance mode setting
      try {
        const settingsRef = doc(db, "settings", "general");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setMaintenanceMode(!!settingsSnap.data().maintenanceMode);
        }
      } catch (err) {
        console.error("Failed to fetch maintenance mode:", err);
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
    router.push("/change-password");
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
    setTimeout(() => {
        router.push("/login");
      }, 3000);
    return <NoDataError />;
  }

  return (
    <main className="main-container">
      <Letterhead />
      <div className="dashboard-container">
        <h2 className="title">Student Dashboard</h2>

        <StudentProfileCard
          photoURL={studentData.photoURL}
          fullName={studentData.fullName}
          studentId={studentData.studentId}
        />

        <StudentDetailsGrid
          email={studentData.email}
          className={studentData.className}
          gender={studentData.gender}
          department={studentData.department}
        />

        <SubjectsTable
          subjects={studentData.subjects}
          onTakeExam={handleTakeExam}
          maintenanceMode={maintenanceMode}
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
