import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const resetAllStudentExamStatus = async () => {
  try {
    const studentsSnapshot = await getDocs(collection(db, "students"));

    const updates = studentsSnapshot.docs.map(async (studentDoc) => {
      const studentData = studentDoc.data();

      const updatedSubjects = (studentData.subjects || []).map((subject) => ({
        ...subject,
        score: 0,
        examTaken: false,
      }));

      await updateDoc(doc(db, "students", studentDoc.id), {
        subjects: updatedSubjects,
        examTaken: false, // if you still track this globally
      });
    });

    await Promise.all(updates);
  } catch (error) {
    console.error("Error resetting exam statuses:", error);
    throw error;
  }
};
