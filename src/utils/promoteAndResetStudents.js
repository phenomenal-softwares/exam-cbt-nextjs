import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const promoteAndResetStudents = async () => {
  const studentsRef = collection(db, "students");

  // Fetch all students from the students collection
  const snapshot = await getDocs(studentsRef);
  
  snapshot.forEach(async (docSnapshot) => {
    const studentData = docSnapshot.data();
    const studentRef = doc(db, "students", docSnapshot.id);

    if (studentData.class === "SS3") {
      // SS3 students have graduated, delete their records
      await deleteDoc(studentRef);
    } else {
      // Promote other students to the next class
      let newClass = "";
      if (studentData.class === "SS1") newClass = "SS2";
      if (studentData.class === "SS2") newClass = "SS3";

      // Update class and reset exam status for all subjects
      await updateDoc(studentRef, {
        class: newClass,
        examTaken: false,
        subjects: studentData.subjects.map((subject) => ({
          ...subject,
          examTaken: false,
          score: 0,
        })),
      });
    }
  });
};

export default promoteAndResetStudents;
