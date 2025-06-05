import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const getConfigForSubject = async (classLevel, subject) => {
  const configRef = doc(db, `Questions/${classLevel}/${subject}/config`);
  
  try {
    const configSnap = await getDoc(configRef);

    if (configSnap.exists()) {
      const data = configSnap.data();
      return {
        totalQuestions: data.totalQuestions || 20,
        timeLimit: data.timeLimit || 15,
      };
    } else {
      // Config doc doesn't exist
      return {
        totalQuestions: 20,
        timeLimit: 15,
      };
    }
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return {
      totalQuestions: 20,
      timeLimit: 15,
    };
  }
};
