import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

export const saveMessageToDatabase = async ({ name, class: className, department, message }) => {
  try {
    // Optional safety check: enforce 250 char limit here too
    if (!message || message.trim().length === 0 || message.length > 250) {
      throw new Error("Message must be between 1 and 250 characters.");
    }

    await addDoc(collection(db, "messages"), {
      name,
      class: className,
      department,
      message: message.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
