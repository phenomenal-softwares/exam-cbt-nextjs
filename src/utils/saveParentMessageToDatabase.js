import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

export const saveParentMessageToDatabase = async ({ fullName, message }) => {
  try {
    // Validation
    if (!message || message.trim().length === 0 || message.length > 250) {
      throw new Error("Message must be between 1 and 250 characters.");
    }

    await addDoc(collection(db, "parentMessages"), {
      fullName,
      message: message.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending parent message:", error);
    throw error;
  }
};
