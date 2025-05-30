import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const defaultSubjects = {
  Science: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'Agricultural Science',
  ],
  Art: [
    'Mathematics',
    'English Language',
    'Government',
    'Literature',
    'CRS',
    'Civic Education',
    'History',
  ],
  Commercial: [
    'Mathematics',
    'English Language',
    'Accounting',
    'Commerce',
    'Economics',
    'Marketing',
    'Office Practice',
  ],
};

// NEW: Async version to fetch maintenance mode status
export async function generateSubjectList(department) {
  const normalizedDepartment =
    department.charAt(0).toUpperCase() + department.slice(1).toLowerCase();

  // Default assumption: exams are open
  let isMaintenanceOn = false;

  try {
    const settingsRef = doc(db, "settings", "general");
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      isMaintenanceOn = !!snap.data().maintenanceMode;
    }
  } catch (error) {
    console.warn("Could not fetch maintenance mode status:", error);
    // Continue with examTaken = false to avoid blocking registration
  }

  return (
    defaultSubjects[normalizedDepartment]?.map((name) => ({
      name,
      examTaken: isMaintenanceOn, // Set to true if maintenance is on
      score: 0,
    })) || []
  );
}
