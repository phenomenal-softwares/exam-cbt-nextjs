"use client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export const updateSubjectExamStatus = async (uid, subject, score) => {
  try {
    const studentRef = doc(db, "students", uid);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      const subjects = studentData.subjects || [];

      // Update the subject in the array
      const updatedSubjects = subjects.map((subj) =>
        subj.name === subject
          ? { ...subj, examTaken: true, score: score }
          : subj
      );

      // Save the updated array back to Firestore
      await updateDoc(studentRef, {
        subjects: updatedSubjects
      });

      console.log("Subject updated successfully");
    } else {
      console.error("Student not found in Firestore");
    }
  } catch (error) {
    console.error("Error updating subject exam status:", error);
  }
};
